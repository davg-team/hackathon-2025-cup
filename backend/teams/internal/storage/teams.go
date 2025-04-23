package storage

import (
	"context"

	"github.com/davg/teams/internal/domain/models"
	"github.com/davg/teams/internal/domain/schemas"
)

func (s *Storage) Teams(ctx context.Context, fspID string) ([]models.Team, error) {
	var teams []models.Team
	query := s.db.Table("teams")
	if fspID != "" {
		query = query.Where("fsp_id = ?", fspID)
	}

	if err := query.Find(&teams).Error; err != nil {
		return nil, err
	}
	return teams, nil
}

func (s *Storage) Team(ctx context.Context, id string) (models.Team, error) {
	var team models.Team
	if err := s.db.Table("teams").Where("id = ?", id).First(&team).Error; err != nil {
		return models.Team{}, err
	}
	return team, nil
}

func (s *Storage) CreateTeam(ctx context.Context, team models.Team) error {
	if err := s.db.Table("teams").Create(&team).Error; err != nil {
		return err
	}
	return nil
}

func (s *Storage) DeleteTeam(ctx context.Context, id string) error {
	if err := s.db.Table("teams").Where("id = ?", id).Delete(&models.Team{}).Error; err != nil {
		return err
	}
	return nil
}

func (s *Storage) UpdateTeam(ctx context.Context, id string, team schemas.TeamPUTSchema) error {
	if err := s.db.Table("teams").Model(&team).Where("id = ?", id).Updates(&team).Error; err != nil {
		return err
	}
	return nil
}
