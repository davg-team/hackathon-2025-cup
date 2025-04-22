package service

import (
	"context"
	"encoding/json"
	"log/slog"

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
	Applications(ctx context.Context, applicationStatus string, teamID string) ([]models.ApplicationModel, error)
}

type ApplicationService struct {
	storage ApplicationStorage
	log     *slog.Logger
}

func New(storage ApplicationStorage, log *slog.Logger) *ApplicationService {
	log = log.With("service", "ApplicationService")
	return &ApplicationService{storage: storage, log: log}
}

func (s *ApplicationService) CreateApplication(ctx context.Context, application requests.CreateApplicationRequest) (string, error) {
	const op = "ApplicationService.CreateApplication"
	log := s.log.With("op", op)

	log.Info("creating application")

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
		Members:           members,
	}

	if err := s.storage.CreateApplication(ctx, applicationModel); err != nil {
		log.Error("failed to create application", "error", err.Error())
		return "", customerrors.ErrBadRequest
	}

	return applicationID, nil
}

// TODO: get members metadata
func (s *ApplicationService) Application(ctx context.Context, id string) (responses.GetApplicationResponse, error) {
	const op = "ApplicationService.Application"
	log := s.log.With("op", op)

	log.Info("getting application")

	application, err := s.storage.Application(ctx, id)
	if err != nil {
		log.Error("failed to get application", "error", err.Error())
		return responses.GetApplicationResponse{}, customerrors.ErrInternal
	}

	responseApplication := responses.GetApplicationResponse{
		ApplicationID:     application.ID,
		EventID:           application.EventID,
		ApplicationStatus: application.ApplicationStatus,
		TeamID:            application.TeamID,
		TeamType:          application.TeamType,
		Members:           application.Members,
	}

	return responseApplication, nil
}

func (s *ApplicationService) Applications(ctx context.Context, applicationStatus string, teamID string) ([]responses.GetApplicationResponse, error) {
	const op = "ApplicationService.Applications"
	log := s.log.With("op", op)

	log.Info("getting applications")

	applications, err := s.storage.Applications(ctx, applicationStatus, teamID)
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
			Members:           application.Members,
		}

		responseApplications = append(responseApplications, responseApplication)
	}

	return responseApplications, nil
}
