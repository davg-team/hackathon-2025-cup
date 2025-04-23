package service

import (
	"context"
	"log/slog"

	"github.com/davg/internal/domain"
	"github.com/davg/internal/domain/requests"
	customerrors "github.com/davg/pkg/errors"
	"github.com/google/uuid"
)

type ResultsStorage interface {
	Results(ctx context.Context) ([]domain.Result, error)
	Result(ctx context.Context, id string) (*domain.Result, error)
	CreateResult(ctx context.Context, result *domain.Result) error
	UpdateResult(ctx context.Context, result *domain.Result) error
	DeleteResult(ctx context.Context, id string) error
	UsersResults(ctx context.Context, userID string) ([]domain.Result, error)
	TeamsResults(ctx context.Context, teamID string) ([]domain.Result, error)
	EventsResults(ctx context.Context, eventID string) ([]domain.Result, error)
}

type Service struct {
	storage ResultsStorage
	log     *slog.Logger
}

func New(storage ResultsStorage, log *slog.Logger) *Service {
	log = log.With("service", "results")

	return &Service{storage: storage, log: log}
}

func (s *Service) Results(ctx context.Context) ([]domain.Result, error) {
	const op = "Results"

	log := s.log.With("op", op)
	log.Info("getting results")

	results, err := s.storage.Results(ctx)
	if err != nil {
		log.Error("failed to get results", err)
		return nil, err
	}

	log.Info("results got", "count", len(results))

	return results, nil
}

func (s *Service) Result(ctx context.Context, id string) (*domain.Result, error) {
	const op = "Result"

	log := s.log.With("op", op)
	log.Info("getting result", "id", id)

	result, err := s.storage.Result(ctx, id)
	if err != nil {
		log.Error("failed to get result", "id", id, err)
		return nil, err
	}

	log.Info("result got", "id", id)

	return result, nil
}

func (s *Service) CreateResult(ctx context.Context, resultToCreate *requests.ResultPost) error {
	const op = "CreateResult"

	id := uuid.New().String()

	log := s.log.With("op", op)
	log.Info("creating result", "id", id)

	result := &domain.Result{
		ID:      id,
		EventID: resultToCreate.EventID,
		UserID:  resultToCreate.UserID,
		TeamID:  resultToCreate.TeamID,
		Place:   resultToCreate.Place,
	}

	if err := s.storage.CreateResult(ctx, result); err != nil {
		log.Error("failed to create result", "id", result.ID, err)
		return err
	}

	log.Info("result created", "id", result.ID)

	return nil
}

func (s *Service) CreateResults(ctx context.Context, resultsToCreate *requests.ComplexResultPost) error {
	const op = "CreateResults"

	log := s.log.With("op", op)
	log.Info("creating results", "count", len(resultsToCreate.Teams))

	for _, teamResult := range resultsToCreate.Teams {
		for _, userID := range teamResult.MembersIDs {
			result := &requests.ResultPost{
				EventID: resultsToCreate.EventID,
				UserID:  userID,
				TeamID:  teamResult.TeamID,
				Place:   teamResult.Place,
			}

			if err := s.CreateResult(ctx, result); err != nil {
				log.Error("failed to create result", "id", userID, err)
				return err
			}
		}

	}

	return nil
}

func (s *Service) UpdateResult(ctx context.Context, id string, resultToUpdate *requests.ResultPost) error {
	const op = "UpdateResult"

	log := s.log.With("op", op)
	log.Info("updating result", "id", id)

	resultFound, err := s.storage.Result(ctx, id)
	if err != nil {
		log.Error("failed to get result", "id", id, err)
		return err
	}

	if resultFound == nil {
		log.Error("result not found", "id", id)
		return customerrors.ErrNotFound
	}

	log.Info("result found", "id", id)

	result := &domain.Result{
		ID:      id,
		EventID: resultToUpdate.EventID,
		UserID:  resultToUpdate.UserID,
		TeamID:  resultToUpdate.TeamID,
		Place:   resultToUpdate.Place,
	}

	if err := s.storage.UpdateResult(ctx, result); err != nil {
		log.Error("failed to update result", "id", result.ID, err)
		return err
	}

	log.Info("result updated", "id", result.ID)

	return nil
}

func (s *Service) DeleteResult(ctx context.Context, id string) error {
	const op = "DeleteResult"

	log := s.log.With("op", op)
	log.Info("deleting result", "id", id)

	result, err := s.storage.Result(ctx, id)
	if err != nil {
		log.Error("failed to get result", "id", id, err)
		return err
	}

	if result == nil {
		log.Error("result not found", "id", id)
		return customerrors.ErrNotFound
	}

	if err := s.storage.DeleteResult(ctx, id); err != nil {
		log.Error("failed to delete result", "id", id, err)
		return err
	}

	log.Info("result deleted", "id", id)

	return nil
}

func (s *Service) UsersResults(ctx context.Context, userID string) ([]domain.Result, error) {
	const op = "UsersResults"

	log := s.log.With("op", op)
	log.Info("getting user results", "user_id", userID)

	results, err := s.storage.UsersResults(ctx, userID)
	if err != nil {
		log.Error("failed to get user results", "user_id", userID, err)
		return nil, err
	}

	log.Info("user results got", "user_id", userID, "count", len(results))

	return results, nil

}

func (s *Service) TeamsResults(ctx context.Context, teamID string) ([]domain.Result, error) {
	const op = "TeamsResults"

	log := s.log.With("op", op)
	log.Info("getting team results", "team_id", teamID)

	results, err := s.storage.TeamsResults(ctx, teamID)
	if err != nil {
		log.Error("failed to get team results", "team_id", teamID, err)
		return nil, err
	}

	log.Info("team results got", "team_id", teamID, "count", len(results))

	return results, nil
}

func (s *Service) EventsResults(ctx context.Context, eventID string) ([]domain.Result, error) {
	const op = "EventsResults"

	log := s.log.With("op", op)
	log.Info("getting event results", "event_id", eventID)

	results, err := s.storage.EventsResults(ctx, eventID)
	if err != nil {
		log.Error("failed to get event results", "event_id", eventID, err)
		return nil, err
	}

	log.Info("event results got", "event_id", eventID, "count", len(results))

	return results, nil
}
