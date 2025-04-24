package service

import (
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"slices"
	"time"

	"github.com/davg/applications-service/internal/customerrors"
	"github.com/davg/applications-service/internal/domain/models"
	"github.com/davg/applications-service/internal/domain/requests"
	"github.com/davg/applications-service/internal/domain/responses"
	"github.com/google/uuid"
	"gorm.io/datatypes"
)

type ApplicationStorage interface {
	CreateApplication(ctx context.Context, application models.ApplicationModel) error
	Application(ctx context.Context, id string) (models.ApplicationModel, error)
	Applications(ctx context.Context, applicationStatus string, teamID string, eventID string) ([]models.ApplicationModel, error)
	UpdateApplication(ctx context.Context, applicationID string, applicationStatus string, members datatypes.JSON) error

	CreateTeamApplication(ctx context.Context, application models.TeamApplicationModel) error
	TeamApplication(ctx context.Context, id string) (models.TeamApplicationModel, error)
	TeamApplications(ctx context.Context, teamID string, applicantID string) ([]models.TeamApplicationModel, error)
	UpdateTeamApplication(ctx context.Context, applicationID string, applicationStatus string) error
}

type ApplicationService struct {
	storage ApplicationStorage
	log     *slog.Logger
}

func New(storage ApplicationStorage, log *slog.Logger) *ApplicationService {
	log = log.With("service", "ApplicationService")
	return &ApplicationService{storage: storage, log: log}
}

// TODO: check if user from region where event is held
func (s *ApplicationService) CreateApplication(ctx context.Context, application requests.CreateApplicationRequest, captainID string, captainRegion string) (string, error) {
	const op = "ApplicationService.CreateApplication"
	log := s.log.With("op", op)

	log.Info("creating application")

	// Event Check Logic
	event, err := GetEventData(ctx, application.EventID)
	if err != nil {
		return "", fmt.Errorf("failed to get event: %w", err)
	}

	if event.Type == "school" || event.Type == "city" || event.Type == "regional" {
		// && captainRegion != "0"
		if !slices.Contains(event.Regions, captainRegion) {
			return "", fmt.Errorf("captain is not from event region")
		}
	}

	// Preload Team Data logic
	if application.TeamType == "permanent" {
		teamData, err := GetTeamData(ctx, application.TeamID)
		if err != nil {
			return "", fmt.Errorf("failed to get team data: %w", err)
		}

		application.TeamName = teamData.Name
		application.Members = teamData.Participants
	}

	var members datatypes.JSON

	membersString, err := json.Marshal(application.Members)
	if err != nil {
		log.Error("failed to marshal members", "error", err.Error())
		return "", customerrors.ErrInternal
	}

	if err := json.Unmarshal(membersString, &members); err != nil {
		log.Error("failed to unmarshal members", "error", err.Error())
		return "", customerrors.ErrInternal
	}

	applicationID := uuid.New().String()

	applicationModel := models.ApplicationModel{
		ID:                applicationID,
		EventID:           application.EventID,
		ApplicationStatus: application.ApplicationStatus,
		TeamID:            application.TeamID,
		TeamType:          application.TeamType,
		CaptainID:         captainID,
		TeamName:          application.TeamName,
		Members:           members,
	}

	if err := s.storage.CreateApplication(ctx, applicationModel); err != nil {
		log.Error("failed to create application", "error", err.Error())
		return "", customerrors.ErrBadRequest
	}

	return applicationID, nil
}

func (s *ApplicationService) Application(ctx context.Context, id string) (responses.GetApplicationResponse, error) {
	const op = "ApplicationService.Application"
	log := s.log.With("op", op)

	log.Info("getting application")

	application, err := s.storage.Application(ctx, id)
	if err != nil {
		log.Error("failed to get application", "error", err.Error())
		return responses.GetApplicationResponse{}, customerrors.ErrInternal
	}

	membersList, err := json.Marshal(application.Members)

	if err != nil {
		return responses.GetApplicationResponse{}, customerrors.ErrInternal
	}

	members, err := GetUsersData(ctx, membersList)

	if err != nil {
		return responses.GetApplicationResponse{}, customerrors.ErrInternal
	}

	responseApplication := responses.GetApplicationResponse{
		ApplicationID:     application.ID,
		EventID:           application.EventID,
		ApplicationStatus: application.ApplicationStatus,
		TeamID:            application.TeamID,
		TeamType:          application.TeamType,
		TeamName:          application.TeamName,
		CaptainID:         application.CaptainID,
		CreatedAt:         application.CreatedAt.Format(time.RFC3339),
		Members:           members,
	}

	return responseApplication, nil
}

func (s *ApplicationService) Applications(ctx context.Context, applicationStatus string, teamID string, eventID string) ([]responses.GetApplicationResponse, error) {
	const op = "ApplicationService.Applications"
	log := s.log.With("op", op)

	log.Info("getting applications")

	applications, err := s.storage.Applications(ctx, applicationStatus, teamID, eventID)
	if err != nil {
		log.Error("failed to get applications", "error", err.Error())
		return nil, customerrors.ErrInternal
	}

	var responseApplications []responses.GetApplicationResponse

	for _, application := range applications {
		responseApplication := responses.GetApplicationResponse{
			ApplicationID:     application.ID,
			EventID:           application.EventID,
			ApplicationStatus: application.ApplicationStatus,
			TeamID:            application.TeamID,
			TeamType:          application.TeamType,
			TeamName:          application.TeamName,
			CaptainID:         application.CaptainID,
			CreatedAt:         application.CreatedAt.Format(time.RFC3339),
			Members:           application.Members,
		}

		responseApplications = append(responseApplications, responseApplication)
	}

	return responseApplications, nil
}

func (s *ApplicationService) UpdateApplicationStatus(ctx context.Context, applicationID string, applicationStatus string) error {
	const op = "ApplicationService.UpdateApplicationStatus"
	log := s.log.With("op", op)

	log.Info("updating application status")

	if applicationStatus != "pending" && applicationStatus != "approved" && applicationStatus != "rejected" && applicationStatus != "team" {
		return fmt.Errorf("invalid application status: %s", applicationStatus)
	}

	if err := s.storage.UpdateApplication(ctx, applicationID, applicationStatus, nil); err != nil {
		log.Error("failed to update application status", "error", err.Error())
		return customerrors.ErrBadRequest
	}

	return nil
}

func (s *ApplicationService) CreateTeamApplication(ctx context.Context, application requests.CreateTeamApplicationRequest, aplicantID string) error {
	const op = "ApplicationService.CreateTeamApplication"
	log := s.log.With("op", op)

	log.Info("creating team application")

	eventApplication, err := s.storage.Applications(ctx, "", application.TeamID, "")
	if err != nil {
		log.Error("failed to get applications", "error", err.Error())
		return customerrors.ErrInternal
	}
	if len(eventApplication) == 0 || (eventApplication[len(eventApplication)-1].TeamType != "temporary" && eventApplication[len(eventApplication)-1].ApplicationStatus != "team") {
		return fmt.Errorf("team is not temporary or team is not waiting for members to join or team does not exist")
	}

	applicationModelID := uuid.New().String()

	applicationModel := models.TeamApplicationModel{
		ID:               applicationModelID,
		TeamID:           application.TeamID,
		ApplicantID:      aplicantID,
		ApplicationState: models.ApplicationStatusPending,
	}

	if err := s.storage.CreateTeamApplication(ctx, applicationModel); err != nil {
		log.Error("failed to create team application", "error", err.Error())
		return customerrors.ErrBadRequest
	}

	return nil
}

func (s *ApplicationService) TeamApplication(ctx context.Context, id string) (responses.GetTeamApplicationResponse, error) {
	const op = "ApplicationService.TeamApplication"
	log := s.log.With("op", op)

	log.Info("getting team application")

	application, err := s.storage.TeamApplication(ctx, id)
	if err != nil {
		log.Error("failed to get team application", "error", err.Error())
		return responses.GetTeamApplicationResponse{}, customerrors.ErrInternal
	}

	responseApplication := responses.GetTeamApplicationResponse{
		ID:               application.ID,
		TeamID:           application.TeamID,
		ApplicantID:      application.ApplicantID,
		ApplicationState: application.ApplicationState,
		CreatedAt:        application.CreatedAt.Format(time.RFC3339),
	}

	return responseApplication, nil
}

func (s *ApplicationService) TeamApplications(ctx context.Context, teamID string, applicantID string) ([]responses.GetTeamApplicationResponse, error) {
	const op = "ApplicationService.TeamApplications"
	log := s.log.With("op", op)

	log.Info("getting team applications")

	applications, err := s.storage.TeamApplications(ctx, teamID, applicantID)
	if err != nil {
		log.Error("failed to get team applications", "error", err.Error())
		return nil, customerrors.ErrInternal
	}

	var responseApplications []responses.GetTeamApplicationResponse

	for _, application := range applications {
		responseApplication := responses.GetTeamApplicationResponse{
			ID:               application.ID,
			TeamID:           application.TeamID,
			ApplicantID:      application.ApplicantID,
			ApplicationState: application.ApplicationState,
			CreatedAt:        application.CreatedAt.Format(time.RFC3339),
		}

		responseApplications = append(responseApplications, responseApplication)
	}

	return responseApplications, nil
}

func (s *ApplicationService) UpdateTeamApplication(ctx context.Context, applicationID string, applicationStatus string, captainID string) error {
	const op = "ApplicationService.UpdateTeamApplication"
	log := s.log.With("op", op)

	log.Info("updating team application")

	if applicationStatus != "pending" && applicationStatus != "approved" && applicationStatus != "rejected" {
		return fmt.Errorf("invalid application status: %s", applicationStatus)
	}

	if applicationStatus == "approved" {
		teamApplication, err := s.storage.TeamApplication(ctx, applicationID)
		if err != nil {
			log.Error("failed to get team application", "error", err.Error())
			return customerrors.ErrInternal
		}

		if teamApplication.ApplicationState == "approved" {
			return fmt.Errorf("application is already approved")
		}

		eventApplication, err := s.storage.Applications(ctx, "", teamApplication.TeamID, "")
		if err != nil {
			log.Error("failed to get applications", "error", err.Error())
			return customerrors.ErrInternal
		}

		if len(eventApplication) != 1 {
			return customerrors.ErrBadRequest
		}

		if captainID != eventApplication[0].CaptainID {
			return customerrors.ErrBadRequest
		}

		newMembers, err := json.Marshal(eventApplication[0].Members)
		if err != nil {
			log.Error("failed to marshal members", "error", err.Error())
			return customerrors.ErrInternal
		}

		var newMembersList []string
		json.Unmarshal(newMembers, &newMembersList)

		newMembersList = append(newMembersList, teamApplication.ApplicantID)

		newMembers, err = json.Marshal(newMembersList)
		if err != nil {
			log.Error("failed to marshal members", "error", err.Error())
			return customerrors.ErrInternal
		}

		err = s.storage.UpdateApplication(ctx, eventApplication[0].ID, "", newMembers)
		if err != nil {
			log.Error("failed to update application", "error", err.Error())
			return customerrors.ErrInternal
		}
	}

	err := s.storage.UpdateTeamApplication(ctx, applicationID, applicationStatus)
	if err != nil {
		log.Error("failed to update team application", "error", err.Error())
		return customerrors.ErrBadRequest
	}

	return nil
}
