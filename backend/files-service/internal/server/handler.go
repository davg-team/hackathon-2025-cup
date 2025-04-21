package server

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type Router struct {
	router  *gin.RouterGroup
	service AppService
}

func Register(router *gin.RouterGroup, service AppService) {
	r := Router{
		router:  router,
		service: service,
	}
	r.init()
}

func (r *Router) UploadFile(ctx *gin.Context) {
	file, header, err := ctx.Request.FormFile("file")
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "failed to get file"})
		return
	}

	fileID := uuid.New().String()

	fileID += "." + getExtension(header.Filename)

	err = r.service.UploadFile(ctx.Request.Context(), file, fileID)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to upload file"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "file uploaded successfully", "id": fileID})
}

func getExtension(s string) string {
	return s[strings.LastIndex(s, ".")+1:]
}

func (r *Router) init() {
	group := r.router.Group("/files")
	group.PUT("/upload", r.UploadFile)
}
