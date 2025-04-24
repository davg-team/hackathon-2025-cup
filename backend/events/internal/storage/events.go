package storage

import (
	"context"
	"time"

	"github.com/davg/events/internal/domain/models"
	"github.com/davg/events/internal/domain/schemas"
)

const dbName = "events"

func (s *Storage) CreateEvent(ctx context.Context, event schemas.EventPreCreateSchema) error {
	return s.db.Table(dbName).Create(&event).Error
}

func (s *Storage) GetEventsWithFilters(
	ctx context.Context, organizationID, status, dateFilter, disciplineFilter, typeFilter string,
	maxAge, minAge int,
) ([]models.Event, error) {
	var events []models.Event

	filter := s.db.Table(dbName)
	if organizationID != "" {
		filter = filter.Where("organization_id = ?", organizationID)
	}

	if status != "" && status != "region" {
		filter = filter.Where("status = ?", status)
	} else if status == "region" {
		filter = filter.Where("status IN (?)", []string{models.Published, models.Verified})
	}

	if dateFilter == "upcoming" {
		filter = filter.Where("start_date > ?", time.Now())
	}

	if disciplineFilter != "" {
		filter = filter.Where("discipline = ?", disciplineFilter)
	}

	if typeFilter != "" {
		filter = filter.Where("type = ?", typeFilter)
	}

	if maxAge != 0 {
		filter = filter.Where("max_age <= ?", maxAge)
	}

	if minAge != 0 {
		filter = filter.Where("min_age >= ?", minAge)
	}

	err := filter.Find(&events).Error
	return events, err
}

func (s *Storage) GetEventByID(ctx context.Context, id string) (models.Event, error) {
	var event models.Event
	if err := s.db.Table(dbName).Where("id = ?", id).First(&event).Error; err != nil {
		return models.Event{}, err
	}
	return event, nil
}

func (s *Storage) UpdateEventStatus(ctx context.Context, id string, status string) error {
	return s.db.Table(dbName).Where("id = ?", id).Update("status", status).Error
}

func (s *Storage) DeleteEvent(ctx context.Context, id string) error {
	return s.db.Table(dbName).Where("id = ?", id).Delete(&models.Event{}).Error
}
