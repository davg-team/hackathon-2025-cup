package storage

import (
	"context"

	"github.com/davg/applications-service/internal/domain/models"
)

func (s *Storage) Application(ctx context.Context, id string) (models.ApplicationModel, error) {
	var application models.ApplicationModel

	if err := s.db.Table("applications").Where("id = ?", id).First(&application).Error; err != nil {
		return models.ApplicationModel{}, err
	}

	return application, nil
}

func (s *Storage) Applications(ctx context.Context, applicationStatus string, teamID string) ([]models.ApplicationModel, error) {
	var applications []models.ApplicationModel

	query := s.db.Table("applications")

	if teamID != "" {
		query = query.Where("team_id = ?", teamID)
	}

	if applicationStatus != "" {
		query = query.Where("application_status = ?", applicationStatus)
	}

	if err := query.Find(&applications).Error; err != nil {
		return nil, err
	}

	return applications, nil
}

func (s *Storage) CreateApplication(ctx context.Context, application models.ApplicationModel) error {
	return s.db.Table("applications").Create(&application).Error
}
