package storage

import (
	"context"

	"github.com/davg/teams/internal/domain/models"
	"github.com/google/uuid"
)

func (s *Storage) TeamEvents(ctx context.Context, id string) ([]models.TeamEvent, error) {
	var events []models.TeamEvent
	if err := s.db.Table("team_events").Where("team_id = ?", id).Find(&events).Error; err != nil {
		return nil, err
	}
	return events, nil
}

func (s *Storage) TeamsEvents(ctx context.Context) ([]models.TeamEvent, error) {
	var events []models.TeamEvent
	if err := s.db.Table("team_events").Find(&events).Error; err != nil {
		return nil, err
	}
	return events, nil
}

func (s *Storage) CreateTeamEvent(ctx context.Context, event models.TeamEvent) error {
	event.ID = uuid.New().String()
	if err := s.db.Table("team_events").Create(&event).Error; err != nil {
		return err
	}
	return nil
}

func (s *Storage) UpdateTeamEvent(ctx context.Context, team_id string, event_id string, event models.TeamEvent) error {
	if err := s.db.Table("team_events").Model(&event).Where("team_id = ? AND event_id = ?", team_id, event_id).Updates(&event).Error; err != nil {
		return err
	}
	return nil
}

func (s *Storage) DeleteTeamEvent(ctx context.Context, team_id string, event_id string) error {
	if err := s.db.Table("team_events").Where("team_id = ? AND event_id = ?", team_id, event_id).Delete(&models.TeamEvent{}).Error; err != nil {
		return err
	}
	return nil
}

func (s *Storage) DeleteTeamEvents(ctx context.Context, team_id string) error {
	if err := s.db.Table("team_events").Where("team_id = ?", team_id).Delete(&models.TeamEvent{}).Error; err != nil {
		return err
	}
	return nil
}
