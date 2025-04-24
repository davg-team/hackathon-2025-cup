package storage

import (
	"context"
	"time"

	"github.com/davg/applications-service/internal/domain/models"
	"gorm.io/datatypes"
)

func (s *Storage) Application(ctx context.Context, id string) (models.ApplicationModel, error) {
	var application models.ApplicationModel

	if err := s.db.Table("applications").Where("id = ?", id).First(&application).Error; err != nil {
		return models.ApplicationModel{}, err
	}

	return application, nil
}

func (s *Storage) Applications(ctx context.Context, applicationStatus string, teamID string, eventID string, dateFilter string) ([]models.ApplicationModel, error) {
	var applications []models.ApplicationModel

	query := s.db.Table("applications")

	if teamID != "" {
		query = query.Where("team_id = ?", teamID)
	}

	if applicationStatus != "" {
		query = query.Where("application_status = ?", applicationStatus)
	}

	if eventID != "" {
		query = query.Where("event_id = ?", eventID)
	}

	if dateFilter == "last30" {
		query = query.Where("created_at > ?", time.Now().AddDate(0, -1, 0))
	} else if dateFilter == "last7" {
		query = query.Where("created_at > ?", time.Now().AddDate(0, 0, -7))
	}

	if err := query.Find(&applications).Error; err != nil {
		return nil, err
	}

	return applications, nil
}

func (s *Storage) CreateApplication(ctx context.Context, application models.ApplicationModel) error {
	return s.db.Table("applications").Create(&application).Error
}

func (s *Storage) UpdateApplication(
	ctx context.Context,
	applicationID string,
	applicationStatus string,
	members datatypes.JSON,
) error {
	query := s.db.Table("applications").Where("id = ?", applicationID)
	if applicationStatus != "" {
		query = query.Update("application_status", applicationStatus)
	}
	if members != nil {
		query = query.Update("members", members)
	}
	return query.Error
}

func (s *Storage) CreateTeamApplication(ctx context.Context, application models.TeamApplicationModel) error {
	return s.db.Table("team_applications").Create(&application).Error
}

func (s *Storage) TeamApplication(ctx context.Context, id string) (models.TeamApplicationModel, error) {
	var application models.TeamApplicationModel

	if err := s.db.Table("team_applications").Where("id = ?", id).First(&application).Error; err != nil {
		return models.TeamApplicationModel{}, err
	}

	return application, nil
}

func (s *Storage) TeamApplications(ctx context.Context, teamID string, applicantID string) ([]models.TeamApplicationModel, error) {
	var applications []models.TeamApplicationModel

	query := s.db.Table("team_applications")

	if teamID != "" {
		query = query.Where("team_id = ?", teamID)
	}

	if applicantID != "" {
		query = query.Where("applicant_id = ?", applicantID)
	}

	if err := query.Find(&applications).Error; err != nil {
		return nil, err
	}

	return applications, nil
}

func (s *Storage) UpdateTeamApplication(ctx context.Context, applicationID string, applicationStatus string) error {
	query := s.db.Table("team_applications").Where("id = ?", applicationID)

	if applicationStatus != "" {
		query = query.Update("application_state", applicationStatus)
	}

	return query.Error
}
