package main

import (
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"

	"github.com/davg/files-service/internal/application"
	"github.com/gin-gonic/gin"
)

func main() {
	app.Start()

	ch := make(chan os.Signal, 1)
	signal.Notify(ch, os.Interrupt)

	<-ch

	app.GracefulStop()
}

var app *application.Application
var router *gin.Engine

func init() {
	h := slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
		Level: slog.LevelDebug,
	})
	mainLogger := slog.New(h)

	app = application.New(mainLogger)
	router = app.Router()
}

func Handler(w http.ResponseWriter, r *http.Request) {
	fmt.Println(*r)
	router.ServeHTTP(w, r)
}
