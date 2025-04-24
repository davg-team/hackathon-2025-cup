package server

import (
	"context"
	"fmt"
	"mime/multipart"
	"net/http"
	"time"

	"github.com/davg/files-service/internal/config"
	"github.com/gin-gonic/gin"
)

type AppService interface {
	UploadFile(ctx context.Context, file multipart.File, fileID string) error
}

type Server struct {
	server *http.Server
	engine *gin.Engine
}

func New(service AppService) *Server {
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
