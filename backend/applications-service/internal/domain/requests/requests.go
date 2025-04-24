package requests

type CreateApplicationRequest struct {
	EventID           string   `json:"event_id"`
	ApplicationStatus string   `json:"application_status"`
	TeamID            string   `json:"team_id"`
	TeamName          string   `json:"team_name"`
	TeamType          string   `json:"team_type"`
	Members           []string `json:"members"`
}

type CreateTeamApplicationRequest struct {
	TeamID string `json:"team_id"`
}
