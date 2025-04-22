package requests

type ResultPost struct {
	EventID string `json:"event_id"`
	UserID  string `json:"user_id"`
	TeamID  string `json:"team_id"`
	Place   string `json:"place"`
}

type ComplexResultPost struct {
	EventID string       `json:"event_id"`
	Teams   []TeamResult `json:"teams"`
}

type TeamResult struct {
	TeamID     string   `json:"team_id"`
	MembersIDs []string `json:"members_ids"`
	Place      string   `json:"place"`
}
