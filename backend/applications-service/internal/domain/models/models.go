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
	Regions           datatypes.JSON `json:"regions"`
	EventDate         time.Time      `json:"event_date"`
	ApplicationStatus string         `json:"application_status"`
	TeamID            string         `json:"team_id"`
	CaptainID         string         `json:"captain_id"`
	TeamName          string         `json:"team_name"`
	TeamType          string         `json:"team_type"`
	Members           datatypes.JSON `json:"members"`
	CreatedAt         time.Time      `json:"created_at"`
}

type TeamApplicationModel struct {
	ID               string    `gorm:"primaryKey" json:"id"`
	TeamID           string    `json:"team_id"`
	ApplicantID      string    `json:"applicant_id"`
	ApplicationState string    `json:"application_state"`
	CreatedAt        time.Time `json:"created_at"`
}
