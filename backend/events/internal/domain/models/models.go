package models

import (
	"time"

	"gorm.io/datatypes"
)

// Statuses
const (
	Draft          = "draft"
	Published      = "published" // Published only for school and city level
	OnVerification = "on_verification"
	Verified       = "verified"
	Declined       = "declined"
)

// Types
const (
	School        = "school"
	City          = "city"
	Regional      = "regional"
	InterRegional = "interregional"
	Russian       = "russian"
	International = "international"
)

type Event struct {
	ID              string         `gorm:"primaryKey" json:"id"`
	OrganizationID  string         `json:"organization_id"`
	Title           string         `json:"title"`
	Description     string         `json:"description"`
	Type            string         `json:"type"`
	Discipline      string         `json:"discipline"`
	StartDate       time.Time      `json:"start_date"`
	EndDate         time.Time      `json:"end_date"`
	IsOpen          bool           `json:"is_open"`
	Status          string         `json:"status"`
	Regions         datatypes.JSON `json:"regions"`
	MinAge          int            `json:"min_age"`
	MaxAge          int            `json:"max_age"`
	MaxPeople       int            `json:"max_people"`
	MinPeople       int            `json:"min_people"`
	ProtocolS3Key   string         `json:"protocol_s3_key"`
	EventImageS3Key string         `json:"event_image_s3_key"`
	Stages          datatypes.JSON `json:"stages"`
}
