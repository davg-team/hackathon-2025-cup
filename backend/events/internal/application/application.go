package application

import (
	"log/slog"

	"github.com/davg/events/internal/config"
	"github.com/davg/events/internal/server"
	"github.com/davg/events/internal/service/events"
	"github.com/davg/events/internal/service/telegram"
	"github.com/davg/events/internal/storage"
	"github.com/gin-gonic/gin"
)

type Application struct {
	server *server.Server
}

func New(log *slog.Logger) *Application {
	cfg := config.Config().Bot
	storage := storage.New()

	telegram, err := telegram.NewBotService(cfg.Token)

	if err != nil {
		panic(err)
	}

	service := events.New(log, storage, telegram)

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
