package domain

type Victory struct {
	ID      string `json:"id" gorm:"primary_key"`
	EventID string `json:"event_id"`
	UserID  string `json:"user_id"`
	TeamID  string `json:"team_id"`
	Place   string `json:"place"`
}
