package application

import (
	"log/slog"

	"github.com/davg/teams/internal/server"
	"github.com/davg/teams/internal/service/teams"
	teamsevents "github.com/davg/teams/internal/service/teams_events"
	"github.com/gin-gonic/gin"

	"github.com/davg/teams/internal/storage"
)

type Application struct {
	server *server.Server
}

func New(log *slog.Logger) *Application {
	storage := storage.New()

	teamsService := teams.New(storage, log)
	teamsEventsService := teamsevents.New(storage, log)

	server := server.New(teamsService, teamsEventsService)
	return &Application{server: server}
}

func (a *Application) Start() {
	a.server.Start()
}

func (a *Application) GracefulStop() {
	a.server.GracefulStop()
}

func (a *Application) Router() *gin.Engine {
	return a.server.Router()
}
