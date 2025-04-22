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

type ApplicationModel struct {
	ID                string         `gorm:"primaryKey" json:"id"`
	EventID           string         `json:"event_id"`
	ApplicationStatus string         `json:"application_status"`
	TeamID            string         `json:"team_id"`
	TeamType          string         `json:"team_type"`
	Members           datatypes.JSON `json:"members"`
	CreatedAt         time.Time      `json:"created_at"`
}
