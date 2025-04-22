package server

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/davg/applications-service/internal/config"
	"github.com/davg/applications-service/internal/domain/requests"
	"github.com/davg/applications-service/internal/domain/responses"
	"github.com/gin-gonic/gin"
)

type ApplicationService interface {
	CreateApplication(ctx context.Context, application requests.CreateApplicationRequest) (string, error)
	Application(ctx context.Context, id string) (responses.GetApplicationResponse, error)
	Applications(ctx context.Context, applicationStatus string, teamID string) ([]responses.GetApplicationResponse, error)
}

type Server struct {
	server *http.Server
	engine *gin.Engine
}

func New(service ApplicationService) *Server {
	cfg := config.Config().Server
	engine := gin.Default()

	httpServer := &http.Server{
		Addr:    fmt.Sprintf(":%d", cfg.Port),
		Handler: engine,
	}

	group := engine.Group("/api")

	Register(group, service)

	return &Server{
		server: httpServer,
		engine: engine,
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
