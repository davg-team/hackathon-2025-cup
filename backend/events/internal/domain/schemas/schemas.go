package schemas

import "time"

type EventPOSTSchema struct {
	Title           string   `json:"title"`
	Description     string   `json:"description"`
	Type            string   `json:"type"`
	Discipline      string   `json:"discipline"`
	StartDate       string   `json:"start_date"`
	EndDate         string   `json:"end_date"`
	IsOpen          bool     `json:"is_open"`
	Status          string   `json:"status"`
	Regions         []string `json:"regions"`
	MinAge          int      `json:"min_age"`
	MaxAge          int      `json:"max_age"`
	MaxPeople       int      `json:"max_people"`
	MinPeople       int      `json:"min_people"`
	ProtocolS3Key   string   `json:"protocol_s3_key"`
	EventImageS3Key string   `json:"event_image_s3_key"`
	Stages          []string `json:"stages"`
}

type UpdateEventStatus struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

type EventPreCreateSchema struct {
	ID              string    `json:"id"`
	OrganizationID  string    `json:"organization_id"`
	Title           string    `json:"title"`
	Description     string    `json:"description"`
	Type            string    `json:"type"`
	Discipline      string    `json:"discipline"`
	StartDate       time.Time `json:"start_date"`
	EndDate         time.Time `json:"end_date"`
	IsOpen          bool      `json:"is_open"`
	Status          string    `json:"status"`
	Regions         string    `json:"regions"`
	MinAge          uint32    `json:"min_age"`
	MaxAge          uint32    `json:"max_age"`
	MaxPeople       uint32    `json:"max_people"`
	MinPeople       uint32    `json:"min_people"`
	ProtocolS3Key   string    `json:"protocol_s3_key"`
	EventImageS3Key string    `json:"event_image_s3_key"`
	Stages          string    `json:"stages"`
}
