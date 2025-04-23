package teamsevents

import (
	"context"
	"log/slog"

	"github.com/davg/teams/internal/domain/models"
)

type TeamsEventsStorage interface {
	TeamEvents(ctx context.Context, id string) ([]models.TeamEvent, error)
	TeamsEvents(ctx context.Context) ([]models.TeamEvent, error)
	CreateTeamEvent(ctx context.Context, event models.TeamEvent) error
	UpdateTeamEvent(ctx context.Context, team_id string, event_id string, event models.TeamEvent) error
	DeleteTeamEvent(ctx context.Context, team_id string, event_id string) error
	DeleteTeamEvents(ctx context.Context, team_id string) error
}

type TeamsEventsService struct {
	storage TeamsEventsStorage
	log     *slog.Logger
}

func New(storage TeamsEventsStorage, log *slog.Logger) *TeamsEventsService {
	log = log.With(slog.String("service", "teams_events"))
	return &TeamsEventsService{storage: storage, log: log}
}

func (s *TeamsEventsService) TeamEvents(ctx context.Context, id string) ([]models.TeamEvent, error) {
	const op = "TeamEvents"

	log := s.log.With(slog.String("op", op))
	log.Info("getting team events", slog.String("id", id))

	events, err := s.storage.TeamEvents(ctx, id)
	if err != nil {
		log.Error("failed to get team events", err)
		return nil, err
	}
	log.Info("got team events")
	return events, nil
}

func (s *TeamsEventsService) TeamsEvents(ctx context.Context) ([]models.TeamEvent, error) {
	const op = "TeamsEvents"

	log := s.log.With(slog.String("op", op))
	log.Info("getting teams events")

	events, err := s.storage.TeamsEvents(ctx)
	if err != nil {
		log.Error("failed to get teams events", err)
		return nil, err
	}
	log.Info("got teams events")
	return events, nil
}

func (s *TeamsEventsService) CreateTeamEvent(ctx context.Context, event models.TeamEvent) error {
	const op = "CreateTeamEvent"

	log := s.log.With(slog.String("op", op))
	log.Info("creating team event")

	if err := s.storage.CreateTeamEvent(ctx, event); err != nil {
		log.Error("failed to create team event", err)
		return err
	}
	log.Info("created team event")
	return nil
}

func (s *TeamsEventsService) UpdateTeamEvent(ctx context.Context, team_id string, event_id string, event models.TeamEvent) error {
	const op = "UpdateTeamEvent"

	log := s.log.With(slog.String("op", op))
	log.Info("updating team event", slog.String("team_id", team_id), slog.String("event_id", event_id))

	if err := s.storage.UpdateTeamEvent(ctx, team_id, event_id, event); err != nil {
		log.Error("failed to update team event", err)
		return err
	}
	log.Info("updated team event")
	return nil

}

func (s *TeamsEventsService) DeleteTeamEvent(ctx context.Context, team_id string, event_id string) error {
	const op = "DeleteTeamEvent"

	log := s.log.With(slog.String("op", op))
	log.Info("deleting team event", slog.String("team_id", team_id), slog.String("event_id", event_id))

	if err := s.storage.DeleteTeamEvent(ctx, team_id, event_id); err != nil {
		log.Error("failed to delete team event", err)
		return err
	}
	log.Info("deleted team event")
	return nil
}

func (s *TeamsEventsService) DeleteTeamEvents(ctx context.Context, team_id string) error {
	const op = "DeleteTeamEvents"

	log := s.log.With(slog.String("op", op))
	log.Info("deleting team events", slog.String("team_id", team_id))

	if err := s.storage.DeleteTeamEvents(ctx, team_id); err != nil {
		log.Error("failed to delete team events", err)
		return err
	}
	log.Info("deleted team events")
	return nil
}
