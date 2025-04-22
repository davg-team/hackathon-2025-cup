package utils

import (
	"errors"
	"net/http"

	customerrors "github.com/davg/pkg/errors"
	"github.com/gin-gonic/gin"
)

func HandleError(err error, ctx *gin.Context) {
	if errors.Is(err, customerrors.ErrBadRequest) {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if errors.Is(err, customerrors.ErrNotFound) {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	if errors.Is(err, customerrors.ErrInternal) {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusInternalServerError, gin.H{"error": "internal error"})
	return
}
