package models

import (
	"time"

	"gorm.io/datatypes"
)

const (
	ApplicationStatusPending  = "pending"
	ApplicationStatusApproved = "approved"
	ApplicationStatusTeam     = "team"
	ApplicationStatusDenied   = "denied"
)

const (
	TeamTypeTemporary = "temporary"
	TeamTypePermanent = "permanent"
	TeamTypeSolo      = "solo"
)

type Team struct {
	TeamID   string         `json:"team_id"`
	TeamType string         `json:"team_type"`
	Members  datatypes.JSON `json:"members"`
}

type ApplicationModel struct {
	ID                string    `gorm:"primaryKey" json:"id"`
	EventID           string    `json:"event_id"`
	ApplicationStatus string    `json:"application_status"`
	Team              Team      `json:"team"`
	TeamID            string    `json:"team_id"`
	CreatedAt         time.Time `json:"created_at"`
}
