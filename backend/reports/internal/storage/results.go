package storage

import (
	"context"

	"github.com/davg/internal/domain"
)

func (s *Storage) Results(ctx context.Context) ([]domain.Result, error) {
	var victories []domain.Result
	if err := s.db.Table("results").Find(&victories).Error; err != nil {
		return nil, err
	}

	return victories, nil
}

func (s *Storage) Result(ctx context.Context, id string) (*domain.Result, error) {
	var victory domain.Result
	if err := s.db.Table("results").First(&victory, "id = ?", id).Error; err != nil {
		return nil, err
	}

	return &victory, nil
}

func (s *Storage) UsersResults(ctx context.Context, userID string) ([]domain.Result, error) {
	var victories []domain.Result
	if err := s.db.Table("results").Find(&victories, "user_id = ?", userID).Error; err != nil {
		return nil, err
	}

	return victories, nil
}

func (s *Storage) TeamsResults(ctx context.Context, teamID string) ([]domain.Result, error) {
	var victories []domain.Result
	if err := s.db.Table("results").Find(&victories, "team_id = ?", teamID).Error; err != nil {
		return nil, err
	}

	return victories, nil
}

func (s *Storage) EventsResults(ctx context.Context, eventID string) ([]domain.Result, error) {
	var victories []domain.Result
	if err := s.db.Table("results").Find(&victories, "event_id = ?", eventID).Error; err != nil {
		return nil, err
	}

	return victories, nil
}

func (s *Storage) CreateResult(ctx context.Context, victory *domain.Result) error {
	return s.db.Table("results").Create(victory).Error
}

func (s *Storage) UpdateResult(ctx context.Context, victory *domain.Result) error {
	return s.db.Table("results").Save(victory).Error
}

func (s *Storage) DeleteResult(ctx context.Context, id string) error {
	return s.db.Table("results").Delete(&domain.Result{}, "id = ?", id).Error
}
