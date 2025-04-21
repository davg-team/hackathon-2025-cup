package service

import (
	"context"
	"log/slog"

	"github.com/davg/internal/domain"
	"github.com/davg/internal/domain/requests"
	"github.com/google/uuid"
)

type VictoriesStorage interface {
	Victories(ctx context.Context) ([]domain.Victory, error)
	UsersVictories(ctx context.Context, userID string) ([]domain.Victory, error)
	TeamsVictories(ctx context.Context, teamID string) ([]domain.Victory, error)
	EventsVictories(ctx context.Context, eventID string) ([]domain.Victory, error)
	Victory(ctx context.Context, id string) (*domain.Victory, error)
	CreateVictory(ctx context.Context, victory *domain.Victory) error
	UpdateVictory(ctx context.Context, victory *domain.Victory) error
	DeleteVictory(ctx context.Context, id string) error
}

type Service struct {
	storage VictoriesStorage
	log     *slog.Logger
}

func New(storage VictoriesStorage, log *slog.Logger) *Service {
	log = log.With("service", "victories")

	return &Service{storage: storage, log: log}
}

func (s *Service) Victories(ctx context.Context) ([]domain.Victory, error) {
	const op = "Victories"

	log := s.log.With("op", op)
	log.Info("getting victories")

	victories, err := s.storage.Victories(ctx)
	if err != nil {
		log.Error("failed to get victories", err)
		return nil, err
	}

	log.Info("victories got", "count", len(victories))

	return victories, nil
}

func (s *Service) Victory(ctx context.Context, id string) (*domain.Victory, error) {
	const op = "Victory"

	log := s.log.With("op", op)
	log.Info("getting victory", "id", id)

	victory, err := s.storage.Victory(ctx, id)
	if err != nil {
		log.Error("failed to get victory", "id", id, err)
		return nil, err
	}

	log.Info("victory got", "id", id)

	return victory, nil
}

func (s *Service) CreateVictory(ctx context.Context, victoryToCreate *requests.VictoryPost) error {
	const op = "CreateVictory"

	id := uuid.New().String()

	victory := &domain.Victory{
		ID:      id,
		EventID: victoryToCreate.EventID,
		UserID:  victoryToCreate.UserID,
		TeamID:  victoryToCreate.TeamID,
		Place:   victoryToCreate.Place,
	}

	log := s.log.With("op", op)
	log.Info("creating victory", "id", victory.ID)

	if err := s.storage.CreateVictory(ctx, victory); err != nil {
		log.Error("failed to create victory", "id", victory.ID, err)
		return err
	}

	log.Info("victory created", "id", victory.ID)

	return nil
}

func (s *Service) UpdateVictory(ctx context.Context, id string, victoryToUpdate *requests.VictoryPost) error {
	const op = "UpdateVictory"

	log := s.log.With("op", op)
	log.Info("updating victory", "id", id)

	victoryFound, err := s.storage.Victory(ctx, id)
	if err != nil {
		log.Error("failed to get victory", "id", id, err)
		return err
	}

	if victoryFound == nil {
		log.Error("victory not found", "id", id)
		return nil
	}

	log.Info("victory found", "id", id)

	victory := &domain.Victory{
		ID:      id,
		EventID: victoryToUpdate.EventID,
		UserID:  victoryToUpdate.UserID,
		TeamID:  victoryToUpdate.TeamID,
		Place:   victoryToUpdate.Place,
	}

	if err := s.storage.UpdateVictory(ctx, victory); err != nil {
		log.Error("failed to update victory", "id", victory.ID, err)
		return err
	}

	log.Info("victory updated", "id", victory.ID)

	return nil
}

func (s *Service) DeleteVictory(ctx context.Context, id string) error {
	const op = "DeleteVictory"

	log := s.log.With("op", op)
	log.Info("deleting victory", "id", id)

	victory, err := s.storage.Victory(ctx, id)
	if err != nil {
		log.Error("failed to get victory", "id", id, err)
		return err
	}

	if victory == nil {
		log.Error("victory not found", "id", id)
		return nil
	}

	if err := s.storage.DeleteVictory(ctx, id); err != nil {
		log.Error("failed to delete victory", "id", id, err)
		return err
	}

	log.Info("victory deleted", "id", id)

	return nil
}

func (s *Service) UsersVictories(ctx context.Context, userID string) ([]domain.Victory, error) {
	const op = "UsersVictories"

	log := s.log.With("op", op)
	log.Info("getting user victories", "user_id", userID)

	victories, err := s.storage.UsersVictories(ctx, userID)
	if err != nil {
		log.Error("failed to get user victories", "user_id", userID, err)
		return nil, err
	}

	log.Info("user victories got", "user_id", userID, "count", len(victories))

	return victories, nil

}

func (s *Service) TeamsVictories(ctx context.Context, teamID string) ([]domain.Victory, error) {
	const op = "TeamsVictories"

	log := s.log.With("op", op)
	log.Info("getting team victories", "team_id", teamID)

	victories, err := s.storage.TeamsVictories(ctx, teamID)
	if err != nil {
		log.Error("failed to get team victories", "team_id", teamID, err)
		return nil, err
	}

	log.Info("team victories got", "team_id", teamID, "count", len(victories))

	return victories, nil
}

func (s *Service) EventsVictories(ctx context.Context, eventID string) ([]domain.Victory, error) {
	const op = "EventsVictories"

	log := s.log.With("op", op)
	log.Info("getting event victories", "event_id", eventID)

	victories, err := s.storage.EventsVictories(ctx, eventID)
	if err != nil {
		log.Error("failed to get event victories", "event_id", eventID, err)
		return nil, err
	}

	log.Info("event victories got", "event_id", eventID, "count", len(victories))

	return victories, nil
}
