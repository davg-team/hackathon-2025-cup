package schemas

import (
	"time"

	"gorm.io/datatypes"
)

type GeneralStats struct {
	TotalUsers          int16 `json:"total_users"`
	NewUsers            int16 `json:"new_users"`
	TotalEvents         int16 `json:"total_events"`
	EventsLast30d       int16 `json:"events_last_30d"`
	TotalApplications   int16 `json:"total_applications"`
	ApplicationsLast30d int16 `json:"applications_last_30d"`
}

type ApplacationStats struct {
	Applications []Application `json:"applications"`
}

type Application struct {
	Date      time.Time `json:"date"`
	Submitted int16     `json:"submitted"`
	Approved  int16     `json:"approved"`
}

type DistributionByDiscipline struct {
	Disciplines []DisciplineStats `json:"disciplines"`
}

type DisciplineStats struct {
	Discipline string `json:"discipline"`
	Count      int16  `json:"count"`
}

type DistributionByEventType struct {
	EventTypes []EventTypeStats `json:"event_types"`
}

type EventTypeStats struct {
	EventType string `json:"event_type"`
	Count     int16  `json:"count"`
}

type DistributionByRegion struct {
	Regions []RegionStats `json:"regions"`
}

type RegionStats struct {
	Region string `json:"region"`
	Count  int16  `json:"count"`
}

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
}

type User struct {
	ID       string    `gorm:"primaryKey" json:"id"`
	RegionID string    `json:"region_id"`
	Role     []string  `json:"role"`
	Status   string    `json:"status"`
	Created  time.Time `json:"created"`
}

type TimeSeriesData struct {
	Series []TimeSeriesPoint `json:"series"`
}

type TimeSeriesPoint struct {
	Timestamp time.Time `json:"timestamp"`
	Value     int16     `json:"value"`
}

type DistributionData struct {
	Buckets map[string]int16 `json:"buckets"`
}

type TopRegions struct {
	Regions []Region `json:"regions"`
}

type Region struct {
	Name  string `json:"name"`
	Count int16  `json:"count"`
}
