package server

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/davg/events/internal/config"
	"github.com/davg/events/internal/domain/models"
	"github.com/davg/events/internal/domain/schemas"
	"github.com/davg/events/internal/server/events"
	"github.com/gin-gonic/gin"
)

type EventsService interface {
	CreateEvent(ctx context.Context, event schemas.EventPOSTSchema, organizationID string) error
	GetEventsWithFilters(ctx context.Context, organizationID, status, dateFilter, disciplineFilter, typeFilter string, maxAge, minAge int) ([]models.Event, error)
	GetEventByID(ctx context.Context, id string) (models.Event, error)
	UpdateEventStatus(ctx context.Context, id string, status string, message string) error
	DeleteEvent(ctx context.Context, id string) error
}

type Server struct {
	server *http.Server
	engine *gin.Engine
}

func New(
	eventsService EventsService,
) *Server {
	cfg := config.Config().Server
	engine := gin.Default()
	httpServer := &http.Server{
		Addr:    fmt.Sprintf(":%d", cfg.Port),
		Handler: engine,
	}

	group := engine.Group("/api")
	events.Register(group, eventsService)

	return &Server{
		engine: engine,
		server: httpServer,
	}
}

func (s *Server) Start() {
	if err := s.server.ListenAndServe(); err != nil {
		panic(err)
	}
}

func (s *Server) GracefulStop() {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := s.server.Shutdown(ctx); err != nil {
		panic(err)
	}
}

func (s *Server) Router() *gin.Engine {
	return s.engine
}
