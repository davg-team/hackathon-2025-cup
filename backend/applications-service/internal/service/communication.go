package service

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/davg/applications-service/internal/config"
	"github.com/davg/applications-service/internal/domain/responses"
)

func GetUsersData(ctx context.Context, userIDS []byte) ([]responses.Member, error) {
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

	var users []responses.Member
	err = json.NewDecoder(resp.Body).Decode(&users)
	if err != nil {
		return nil, err
	}

	return users, nil
}

func GetTeamData(ctx context.Context, teamID string) (responses.Team, error) {
	cfg := config.Config().TeamsService

	req, err := http.NewRequestWithContext(ctx, "GET", cfg.URL+"/"+teamID, nil)
	if err != nil {
		return responses.Team{}, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return responses.Team{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return responses.Team{}, fmt.Errorf("failed to get team data, status code: %d", resp.StatusCode)
	}

	var team responses.Team
	err = json.NewDecoder(resp.Body).Decode(&team)
	if err != nil {
		return responses.Team{}, err
	}

	return team, nil
}
