package requests

type ResultPost struct {
	EventID string `json:"event_id"`
	UserID  string `json:"user_id"`
	TeamID  string `json:"team_id"`
	Place   string `json:"place"`
}
