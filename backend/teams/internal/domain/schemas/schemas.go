package schemas

import "gorm.io/datatypes"

type TeamPOSTSchema struct {
	Name         string         `json:"name"`
	Description  string         `json:"description"`
	Captain      string         `json:"captain"`
	Participants datatypes.JSON `json:"participants"`
}

type TeamPUTSchema struct {
	Name         string         `json:"name"`
	Description  string         `json:"description"`
	Captain      string         `json:"captain"`
	Participants datatypes.JSON `json:"participants"`
}

type TeamEventPostSchema struct {
	TeamID    string `json:"team_id"`
	Placement uint8  `json:"placement"`
}

type TeamsEventPostSchema struct {
	EventID         string                `json:"event_id"`
	EventTitle      string                `json:"event_title"`
	EventDiscipline string                `json:"event_discipline"`
	EventType       string                `json:"event_type"`
	Teams           []TeamEventPostSchema `json:"teams"`
}
