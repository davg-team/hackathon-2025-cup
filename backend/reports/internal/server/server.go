package server

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/davg/internal/config"
	"github.com/davg/internal/server/results"

	"github.com/davg/internal/service"
	"github.com/gin-gonic/gin"
)

type Server struct {
	server *http.Server
	engine *gin.Engine
}

func New(VictoriesService *service.Service) *Server {
	cfg := config.Config().Server

	r := gin.Default()

	httpServer := &http.Server{
		Addr:    fmt.Sprintf(":%d", cfg.Port),
		Handler: r,
	}

	group := r.Group("/api")

	results.Register(group, VictoriesService)

	return &Server{server: httpServer, engine: r}
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
