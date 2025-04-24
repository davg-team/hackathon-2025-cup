package application

import (
	"log/slog"

	"github.com/davg/analytics/internal/server"
	"github.com/davg/analytics/internal/service/stats"
	"github.com/gin-gonic/gin"
)

type Application struct {
	server *server.Server
}

func New(log *slog.Logger) *Application {
	statsService := stats.New(log)

	server := server.New(
		statsService,
	)
	return &Application{
		server: server,
	}
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
