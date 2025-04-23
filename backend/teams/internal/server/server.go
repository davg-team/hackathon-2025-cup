package server

import (
	"context"
	"fmt"
	"net/http"

	"github.com/davg/teams/internal/config"
	"github.com/davg/teams/internal/domain/models"
	"github.com/davg/teams/internal/domain/schemas"
	"github.com/davg/teams/internal/server/teams"
	teamsevents "github.com/davg/teams/internal/server/teams_events"
	"github.com/gin-gonic/gin"
)

type TeamsService interface {
	Teams(ctx context.Context, fspID, user_id string) ([]models.Team, error)
	Team(ctx context.Context, id string) (models.Team, error)
	CreateTeam(ctx context.Context, id string, fspID string, team schemas.TeamPOSTSchema) error
	UpdateTeam(ctx context.Context, id string, team schemas.TeamPUTSchema) error
	DeleteTeam(ctx context.Context, id string) error
}

type TeamsEventsService interface {
	TeamEvents(ctx context.Context, id string) ([]models.TeamEvent, error)
	TeamsEvents(ctx context.Context) ([]models.TeamEvent, error)
	CreateTeamEvent(ctx context.Context, event models.TeamEvent) error
	UpdateTeamEvent(ctx context.Context, team_id string, event_id string, event models.TeamEvent) error
	DeleteTeamEvent(ctx context.Context, team_id string, event_id string) error
	DeleteTeamEvents(ctx context.Context, team_id string) error
}

type Server struct {
	server *http.Server
	engine *gin.Engine
}

func New(teamsService TeamsService, teamsEventsService TeamsEventsService) *Server {
	cfg := config.Config().Server

	engine := gin.Default()

	http := &http.Server{
		Addr:    fmt.Sprintf(":%d", cfg.Port),
		Handler: engine,
	}

	group := engine.Group("/api")

	teams.Register(group, teamsService)
	teamsevents.Register(group, teamsEventsService)

	return &Server{
		server: http,
		engine: engine,
	}
}

func (s *Server) Start() {
	if err := s.server.ListenAndServe(); err != nil {
		panic(err)
	}
}

func (s *Server) GracefulStop() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	if err := s.server.Shutdown(ctx); err != nil {
		panic(err)
	}
}

func (s *Server) Router() *gin.Engine {
	return s.engine
}
