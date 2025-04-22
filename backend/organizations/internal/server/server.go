package server

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/davg/internal/config"
	organizationsRouter "github.com/davg/internal/server/organizations"
	organizationsService "github.com/davg/internal/service/organizations"

	"github.com/gin-gonic/gin"
)

type Server struct {
	server *http.Server
	engine *gin.Engine
}

func New(organizationService *organizationsService.OrganizationService) *Server {
	cfg := config.Config().Server

	r := gin.Default()

	httpServer := &http.Server{
		Addr:    fmt.Sprintf(":%d", cfg.Port),
		Handler: r,
	}

	group := r.Group("/api")

	organizationsRouter.Register(group, organizationService)

	return &Server{
		server: httpServer,
		engine: r,
	}
}

func (s *Server) Start() {
	if err := s.server.ListenAndServe(); err != nil {
		panic(err)
	}
}

func (s *Server) GracefulStop() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := s.server.Shutdown(ctx); err != nil {
		panic(err)
	}
}

func (s *Server) Router() *gin.Engine {
	return s.engine
}
