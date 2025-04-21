package utils

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
)

func HandleError(err error, ctx *gin.Context) {
	if errors.Is(err, errors.New("validation error")) {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if errors.Is(err, errors.New("victory not found")) {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	if errors.Is(err, errors.New("internal error")) {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusInternalServerError, gin.H{"error": "internal error"})
	return
}
