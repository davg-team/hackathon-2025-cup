package teams

import (
	"context"
	"encoding/json"
	"log/slog"
	"slices"

	"github.com/davg/teams/internal/domain/models"
	"github.com/davg/teams/internal/domain/schemas"
)

type TeamsStorage interface {
	Teams(ctx context.Context, fspID string) ([]models.Team, error)
	Team(ctx context.Context, id string) (models.Team, error)
	CreateTeam(ctx context.Context, team models.Team) error
	UpdateTeam(ctx context.Context, id string, team schemas.TeamPUTSchema) error
	DeleteTeam(ctx context.Context, id string) error
}

type TeamsService struct {
	storage TeamsStorage
	log     *slog.Logger
}

func New(storage TeamsStorage, log *slog.Logger) *TeamsService {
	log = log.With(slog.String("service", "teams"))
	return &TeamsService{storage: storage, log: log}
}

func (s *TeamsService) Teams(ctx context.Context, fspID, user_id string) ([]models.Team, error) {
	const op = "Teams"

	log := s.log.With(slog.String("op", op))
	log.Info("getting teams")

	teams, err := s.storage.Teams(ctx, fspID)
	if err != nil {
		log.Error("failed to get teams", err)
		return nil, err
	}

	if user_id != "" {
		teamsWithUser := []models.Team{}

		for _, team := range teams {
			participants := []string{}
			json.Unmarshal(team.Participants, &participants)

			if slices.Contains(participants, user_id) {
				log.Debug("team found", slog.String("team_id", team.ID), slog.Any("participants", participants))
				teamsWithUser = append(teamsWithUser, team)
			}
		}

		teams = teamsWithUser
	}

	log.Info("got teams")
	return teams, nil
}

func (s *TeamsService) Team(ctx context.Context, id string) (models.Team, error) {
	const op = "Team"

	log := s.log.With(slog.String("op", op))
	log.Info("getting team", slog.String("id", id))

	team, err := s.storage.Team(ctx, id)
	if err != nil {
		log.Error("failed to get team", err)
		return models.Team{}, err
	}
	log.Info("got team")
	return team, nil
}

func (s *TeamsService) CreateTeam(ctx context.Context, id string, fspID string, team schemas.TeamPOSTSchema) error {
	const op = "CreateTeam"

	log := s.log.With(slog.String("op", op))
	log.Info("creating team")

	teamModel := models.Team{
		ID:           id,
		Name:         team.Name,
		Fsp_id:       fspID,
		Description:  team.Description,
		Captain:      team.Captain,
		Participants: team.Participants,
	}

	if err := s.storage.CreateTeam(ctx, teamModel); err != nil {
		log.Error("failed to create team", err)
		return err
	}
	log.Info("created team")
	return nil
}

func (s *TeamsService) UpdateTeam(ctx context.Context, id string, team schemas.TeamPUTSchema) error {
	const op = "UpdateTeam"

	log := s.log.With(slog.String("op", op))
	log.Info("updating team", slog.String("id", id))

	if err := s.storage.UpdateTeam(ctx, id, team); err != nil {
		log.Error("failed to update team", err)
		return err
	}
	log.Info("updated team")
	return nil
}

func (s *TeamsService) DeleteTeam(ctx context.Context, id string) error {
	const op = "DeleteTeam"

	log := s.log.With(slog.String("op", op))
	log.Info("deleting team", slog.String("id", id))

	if err := s.storage.DeleteTeam(ctx, id); err != nil {
		log.Error("failed to delete team", err)
		return err
	}
	log.Info("deleted team")
	return nil
}
