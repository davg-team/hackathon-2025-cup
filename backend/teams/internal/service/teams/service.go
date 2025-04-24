package teams

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"slices"

	"github.com/davg/teams/internal/config"
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

func (s *TeamsService) Teams(ctx context.Context, fspID, user_id string) ([]schemas.TeamsAnswer, error) {
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

	teamsAns := []schemas.TeamsAnswer{}
	for _, team := range teams {
		members, err := GetUsersData(ctx, team.Participants)

		if err != nil {
			log.Error("failed to get users data", err)
			return nil, err
		}

		teamsAns = append(teamsAns, schemas.TeamsAnswer{
			ID:                   team.ID,
			Name:                 team.Name,
			Description:          team.Description,
			Captain:              team.Captain,
			Participants:         team.Participants,
			ParticipantsMetainfo: members,
		})
	}

	log.Info("got teams")
	return teamsAns, nil
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

func GetUsersData(ctx context.Context, userIDS []byte) ([]schemas.Member, error) {
	cfg := config.Config().UsersService

	req, err := http.NewRequestWithContext(ctx, "POST", cfg.URL+"/get", bytes.NewBuffer(userIDS))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to get users data, status code: %d", resp.StatusCode)
	}

	var users []schemas.Member
	err = json.NewDecoder(resp.Body).Decode(&users)
	if err != nil {
		return nil, err
	}

	return users, nil
}
