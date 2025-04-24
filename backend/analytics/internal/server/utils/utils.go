package utils

import (
	"errors"
	"net/http"

	"github.com/davg/analytics/internal/service"
	"github.com/gin-gonic/gin"
)

func HandleError(err error, ctx *gin.Context) {
	if errors.Is(err, service.ErrBadRequest) {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if errors.Is(err, service.ErrNotFound) {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	if errors.Is(err, service.ErrInternal) {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusInternalServerError, gin.H{"error": "internal error"})
	return
}
