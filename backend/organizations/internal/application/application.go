package application

import (
	"log/slog"

	"github.com/davg/internal/server"
	"github.com/davg/internal/service/organizations"
	"github.com/davg/internal/storage"
	"github.com/gin-gonic/gin"
)

type Application struct {
	server *server.Server
}

func New(log *slog.Logger) *Application {
	storage := storage.New()

	organizationService := organizations.New(storage, log)

	server := server.New(organizationService)

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
