package events

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"time"

	"github.com/davg/events/internal/config"
	"github.com/davg/events/internal/domain/models"
	"github.com/davg/events/internal/domain/schemas"
	"github.com/google/uuid"
)

var superadminIDs []int64 = []int64{1116462644, 493431536, 944384833, 1894858872}

var (
	ErrInternalServer = errors.New("internal server error")
	ErrBadRequest     = errors.New("bad request")
	ErrNotFound       = errors.New("not found")
)

type EventsStorage interface {
	CreateEvent(ctx context.Context, event schemas.EventPreCreateSchema) error
	GetEventsWithFilters(ctx context.Context, organizationID, status, dateFilter, disciplineFilter, typeFilter string, maxAge, minAge int) ([]models.Event, error)
	GetEventByID(ctx context.Context, id string) (models.Event, error)
	UpdateEventStatus(ctx context.Context, id string, status string) error
	DeleteEvent(ctx context.Context, id string) error
}

type telegram interface {
	BroadcastMessage(ctx context.Context, chatIDs []int64, message string)
}

type EventsService struct {
	log      *slog.Logger
	storage  EventsStorage
	telegram telegram
}

func New(log *slog.Logger, storage EventsStorage, telegram telegram) *EventsService {
	log = log.With("service", "events")
	return &EventsService{log: log, storage: storage, telegram: telegram}
}

func (s *EventsService) CreateEvent(ctx context.Context, event schemas.EventPOSTSchema, organizationID string) error { // edit here
	const op = "CreateEvent"
	log := s.log.With("op", op)

	log.Info("creating event")
	log.Debug("event", "event", event)
	log.Debug("organizationID", "organizationID", organizationID)

	regionsSeting, err := json.Marshal(event.Regions)
	if err != nil {
		log.Error("failed to marshal regions", "error", err)
		return fmt.Errorf("%w: %s", ErrInternalServer, "failed to marshal regions")
	}
	regions := string(regionsSeting)

	startTime := convertTime(event.StartDate)
	endTime := convertTime(event.EndDate)

	eventModel := schemas.EventPreCreateSchema{
		ID:              uuid.New().String(),
		OrganizationID:  organizationID,
		Title:           event.Title,
		Description:     event.Description,
		Type:            event.Type,
		Discipline:      event.Discipline,
		StartDate:       startTime,
		EndDate:         endTime,
		IsOpen:          event.IsOpen,
		Status:          event.Status,
		Regions:         regions,
		MinAge:          uint32(event.MinAge),
		MaxAge:          uint32(event.MaxAge),
		MaxPeople:       uint32(event.MaxPeople),
		MinPeople:       uint32(event.MinPeople),
		ProtocolS3Key:   event.ProtocolS3Key,
		EventImageS3Key: event.EventImageS3Key,
	}

	if err := s.storage.CreateEvent(ctx, eventModel); err != nil {
		log.Error("failed to create event", "error", err)
		return fmt.Errorf("%w: %s", ErrInternalServer, "failed to create event")
	}
	return nil
}

func (s *EventsService) GetEventsWithFilters(ctx context.Context, organizationID string, status string, dateFilter string, disciplineFilter string, typeFilter string, maxAge int, minAge int) ([]models.Event, error) {
	const op = "GetEventsWithFilters"
	log := s.log.With("op", op)

	log.Info("getting events with filters")
	log.Debug("organizationID", "organizationID", organizationID)
	log.Debug("status", "status", status)

	events, err := s.storage.GetEventsWithFilters(ctx, organizationID, status, dateFilter, disciplineFilter, typeFilter, maxAge, minAge)
	if err != nil {
		log.Error("failed to get events with filters", "error", err)
		return nil, fmt.Errorf("%w: %s", ErrInternalServer, "failed to get events with filters")
	}
	cfg := config.Config().Bucket
	updatedEvents := []models.Event{}
	for _, event := range events {
		event.ProtocolS3Key = fmt.Sprintf("https://storage.yandexcloud.net/%s/protocols/%s", cfg.Name, event.ProtocolS3Key)
		updatedEvents = append(updatedEvents, event)
	}
	return updatedEvents, nil
}

func (s *EventsService) GetEventByID(ctx context.Context, id string) (models.Event, error) {
	const op = "GetEventByID"
	log := s.log.With("op", op)

	log.Info("getting event by id")
	log.Debug("id", "id", id)

	cfg := config.Config().Bucket

	event, err := s.storage.GetEventByID(ctx, id)
	if err != nil {
		log.Error("failed to get event by id", "error", err)
		return models.Event{}, fmt.Errorf("%w: %s", ErrNotFound, "event not found")
	}
	event.ProtocolS3Key = fmt.Sprintf("https://storage.yandexcloud.net/%s/protocols/%s", cfg.Name, event.ProtocolS3Key)
	return event, nil
}

func (s *EventsService) UpdateEventStatus(ctx context.Context, id string, status string, message string) error { // edit here
	const op = "UpdateEventStatus"
	log := s.log.With("op", op)

	log.Info("updating event status")
	log.Debug("id", "id", id)
	log.Debug("status", "status", status)

	event, err := s.storage.GetEventByID(ctx, id)

	if err != nil {
		log.Error("failed to get event by id", "error", err)
		return fmt.Errorf("%w: %s", ErrInternalServer, "failed to get event by id")
	}

	if event.Status == status {
		return fmt.Errorf("%w: %s", ErrBadRequest, "event is already in this status")
	}

	if status == "published" && (event.Type != "city" && event.Type != "school") {
		return fmt.Errorf(
			"%w: %s",
			ErrBadRequest,
			"event type must be city or school, because published is used only with these types",
		)
	}

	if err := s.storage.UpdateEventStatus(ctx, id, status); err != nil {
		log.Error("failed to update event status", "error", err)
		return fmt.Errorf("%w: %s", ErrBadRequest, "failed to update event status")
	}

	switch status {
	case "declined":
		sendNotification(event.OrganizationID, message, "Отказ в заявке")
	case "on_verification":
		s.telegram.BroadcastMessage(
			ctx,
			superadminIDs,
			fmt.Sprintf(
				"*Новая заявка на событие:* %s\n\nОписание: %s\nТип: %s\nДисциплина: %s\nВремя: %s - %s",
				event.Title,
				event.Description,
				event.Type,
				event.Discipline,
				event.StartDate,
				event.EndDate,
			),
		)
	case "verified":
		regionsSeting, err := json.Marshal(event.Regions)
		if err != nil {
			log.Error("failed to marshal regions", "error", err)
			return fmt.Errorf("%w: %s", ErrInternalServer, "failed to marshal regions")
		}
		regions := string(regionsSeting)
		s.storage.CreateEvent(ctx, schemas.EventPreCreateSchema{

			OrganizationID:  "0",
			Title:           event.Title,
			Description:     event.Description,
			Type:            event.Type,
			Discipline:      event.Discipline,
			StartDate:       event.StartDate,
			EndDate:         event.EndDate,
			ProtocolS3Key:   event.ProtocolS3Key,
			EventImageS3Key: event.EventImageS3Key,
			Regions:         regions,
			MinAge:          uint32(event.MinAge),
			MaxAge:          uint32(event.MaxAge),
			MaxPeople:       uint32(event.MaxPeople),
			MinPeople:       uint32(event.MinPeople),
			IsOpen:          event.IsOpen,
			Status:          models.Verified,
		})
	}
	return nil
}

func (s *EventsService) DeleteEvent(ctx context.Context, id string) error {
	const op = "DeleteEvent"
	log := s.log.With("op", op)

	log.Info("deleting event")
	log.Debug("id", "id", id)

	if err := s.storage.DeleteEvent(ctx, id); err != nil {
		log.Error("failed to delete event", "error", err)
		return fmt.Errorf("%w: %s", ErrInternalServer, "failed to delete event")
	}
	return nil
}

func convertTime(t string) time.Time {
	tt, err := time.Parse("2006-01-02", t)
	if err != nil {
		panic(err)
	}
	return tt
}

func sendNotification(fspID, message, messageType string) {
	payload := map[string]interface{}{
		"receiver_id": fspID,
		"text":        message,
		"type":        messageType,
		"sender":      "system",
	}

	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		panic(err)
	}

	req, err := http.NewRequest("POST", "https://fsp.life-course.online/api/auth/notifications/notifications/send", bytes.NewBuffer(payloadBytes))
	if err != nil {
		panic(err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer 1234")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		panic(fmt.Errorf("failed to send notification: %s", resp.Status))
	}
}
