package stats

import (
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"

	"github.com/davg/analytics/internal/config"
	"github.com/davg/analytics/internal/domain/schemas"
)

// GetUsersData gets users data from users service
func GetUsersData(ctx context.Context, logger *slog.Logger, region_id, date_filter string) ([]schemas.User, error) {
	logger.Info("getting users data", "region_id", region_id, "date_filter", date_filter)

	cfg := config.Config().UsersService

	req, err := http.NewRequestWithContext(ctx, "GET", cfg.URL, nil)

	if err != nil {
		logger.Error("failed to get users data", "error", err)
		return nil, err
	}

	q := req.URL.Query()
	q.Add("region_id", region_id)
	q.Add("date_filter", date_filter)
	q.Add("role", "sportsman")
	q.Add("status", "active")
	req.URL.RawQuery = q.Encode()
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")
	logger.Debug("getting users data", "url", req.URL.String())
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		logger.Error("failed to get users data", "error", err)
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		logger.Error("failed to get users data", "status_code", resp.StatusCode)
		return nil, fmt.Errorf("failed to get users data, status code: %d", resp.StatusCode)
	}

	var users []schemas.User
	err = json.NewDecoder(resp.Body).Decode(&users)
	if err != nil {
		logger.Error("failed to get users data", "error", err)
		return nil, err
	}

	logger.Debug("got users data", "count", len(users))

	return users, nil
}

// GetEventsData gets events data from events service
func GetEventsData(ctx context.Context, logger *slog.Logger, discipline_filter, organization_id, date_filter string) ([]schemas.Event, error) {
	logger.Info("getting events data", "discipline_filter", discipline_filter, "organization_id", organization_id, "date_filter", date_filter)

	cfg := config.Config().EventsService

	req, err := http.NewRequestWithContext(ctx, "GET", cfg.URL, nil)
	if err != nil {
		logger.Error("failed to get events data", "error", err)
		return nil, err
	}
	q := req.URL.Query()
	q.Add("discipline_filter", discipline_filter)
	q.Add("organization_id", organization_id)
	q.Add("date_filter", date_filter)
	req.URL.RawQuery = q.Encode()
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		logger.Error("failed to get events data", "error", err)
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		logger.Error("failed to get events data", "status_code", resp.StatusCode)
		return nil, fmt.Errorf("failed to get events data, status code: %d", resp.StatusCode)
	}

	var events []schemas.Event
	err = json.NewDecoder(resp.Body).Decode(&events)
	if err != nil {
		logger.Error("failed to get events data", "error", err)
		return nil, err
	}

	logger.Debug("got events data", "count", len(events))

	return events, nil
}

// GetApplicationsData gets applications data from application service
func GetApplicationsData(ctx context.Context, logger *slog.Logger, region, from, to string) ([]schemas.Application, error) {
	logger.Info("getting applications data", "from", from, "to", to)

	cfg := config.Config().ApplicationService

	req, err := http.NewRequestWithContext(ctx, "GET", cfg.URL, nil)
	if err != nil {
		logger.Error("failed to get applications data", "error", err)
		return nil, err
	}
	q := req.URL.Query()
	q.Add("from", from)
	q.Add("to", to)
	q.Add("region", region)
	req.URL.RawQuery = q.Encode()
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		logger.Error("failed to get applications data", "error", err)
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		logger.Error("failed to get applications data", "status_code", resp.StatusCode)
		return nil, fmt.Errorf("failed to get applications data, status code: %d", resp.StatusCode)
	}

	var applications []schemas.Application
	err = json.NewDecoder(resp.Body).Decode(&applications)
	if err != nil {
		logger.Error("failed to get applications data", "error", err)
		return nil, err
	}

	logger.Debug("got applications data", "count", len(applications))

	return applications, nil
}
