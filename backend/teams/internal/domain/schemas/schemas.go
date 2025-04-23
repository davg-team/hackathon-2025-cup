package schemas

import "gorm.io/datatypes"

type TeamsAnswer struct {
	ID                   string         `json:"id"`
	Name                 string         `json:"name"`
	Fsp_id               string         `json:"fsp_id"`
	Description          string         `json:"description"`
	Captain              string         `json:"captain"`
	Participants         datatypes.JSON `json:"participants"`
	ParticipantsMetainfo []Member       `json:"participants_metainfo"`
}

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

type Member struct {
	MemberID        string `json:"id"`
	MemberFirstName string `json:"first_name"`
	MemberLastName  string `json:"last_name"`
	MemberEmail     string `json:"email"`
	MemberAvatar    string `json:"avatar"`
}
