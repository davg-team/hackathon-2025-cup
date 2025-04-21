package storage

import (
	"context"

	"github.com/davg/internal/domain"
)

func (s *Storage) Victories(ctx context.Context) ([]domain.Victory, error) {
	var victories []domain.Victory
	if err := s.db.Table("victory").Find(&victories).Error; err != nil {
		return nil, err
	}

	return victories, nil
}

func (s *Storage) Victory(ctx context.Context, id string) (*domain.Victory, error) {
	var victory domain.Victory
	if err := s.db.Table("victory").First(&victory, "id = ?", id).Error; err != nil {
		return nil, err
	}

	return &victory, nil
}

func (s *Storage) UsersVictories(ctx context.Context, userID string) ([]domain.Victory, error) {
	var victories []domain.Victory
	if err := s.db.Table("victory").Find(&victories, "user_id = ?", userID).Error; err != nil {
		return nil, err
	}

	return victories, nil
}

func (s *Storage) TeamsVictories(ctx context.Context, teamID string) ([]domain.Victory, error) {
	var victories []domain.Victory
	if err := s.db.Table("victory").Find(&victories, "team_id = ?", teamID).Error; err != nil {
		return nil, err
	}

	return victories, nil
}

func (s *Storage) EventsVictories(ctx context.Context, eventID string) ([]domain.Victory, error) {
	var victories []domain.Victory
	if err := s.db.Table("victory").Find(&victories, "event_id = ?", eventID).Error; err != nil {
		return nil, err
	}

	return victories, nil
}

func (s *Storage) CreateVictory(ctx context.Context, victory *domain.Victory) error {
	return s.db.Table("victory").Create(victory).Error
}

func (s *Storage) UpdateVictory(ctx context.Context, victory *domain.Victory) error {
	return s.db.Table("victory").Save(victory).Error
}

func (s *Storage) DeleteVictory(ctx context.Context, id string) error {
	return s.db.Table("victory").Delete(&domain.Victory{}, "id = ?", id).Error
}
