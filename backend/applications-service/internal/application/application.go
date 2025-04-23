package application

import (
	"log/slog"

	"github.com/davg/applications-service/internal/server"
	"github.com/davg/applications-service/internal/service"
	"github.com/davg/applications-service/internal/storage"
	"github.com/gin-gonic/gin"
)

type Application struct {
	server *server.Server
}

func New(log *slog.Logger) *Application {
	storage := storage.New()

	service := service.New(storage, log)

	server := server.New(service)

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
