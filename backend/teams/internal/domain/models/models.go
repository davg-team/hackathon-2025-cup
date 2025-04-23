package models

import "gorm.io/datatypes"

type Team struct {
	ID           string         `json:"id"`
	Name         string         `json:"name"`
	Fsp_id       string         `json:"fsp_id"`
	Description  string         `json:"description"`
	Captain      string         `json:"captain"`
	Participants datatypes.JSON `json:"participants"`
}

type TeamEvent struct {
	ID              string `json:"id" gorm:"primary_key"`
	EventID         string `json:"event_id"`
	TeamID          string `json:"team_id"`
	EventTitle      string `json:"event_title"`
	EventDiscipline string `json:"event_discipline"`
	EventType       string `json:"event_type"`
	Placement       uint8  `json:"placement"`
}
