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

func (s *Storage) ApplicationsByTeamID(ctx context.Context, teamID string) ([]models.ApplicationModel, error) {
	var applications []models.ApplicationModel

	if err := s.db.Table("applications").Preload("teams").Where("")
}
