package server

import (
	"crypto/rsa"
	"errors"
	"fmt"
	"os"

	"github.com/davg/applications-service/internal/customerrors"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func GetKey() *rsa.PublicKey {
	data, err := os.ReadFile("./keys/public_key.pem")
	if err != nil {
		fmt.Printf("Error reading public key: %v", err)
	}
	key, err := jwt.ParseRSAPublicKeyFromPEM(data)
	if err != nil {
		fmt.Printf("Error parsing public key: %v", err)
	}

	return key
}

func HandleError(ctx *gin.Context, err error) {
	if errors.Is(err, customerrors.ErrBadRequest) {
		ctx.JSON(400, gin.H{"status": "error", "message": err.Error()})
	} else if errors.Is(err, customerrors.ErrUnauthorized) {
		ctx.JSON(401, gin.H{"status": "error", "message": err.Error()})
	} else if errors.Is(err, customerrors.ErrForbidden) {
		ctx.JSON(403, gin.H{"status": "error", "message": err.Error()})
	} else if errors.Is(err, customerrors.ErrNotFound) {
		ctx.JSON(404, gin.H{"status": "error", "message": err.Error()})
	} else if errors.Is(err, customerrors.ErrInternal) {
		ctx.JSON(500, gin.H{"status": "error", "message": err.Error()})
	} else {
		ctx.JSON(500, gin.H{"status": "undocumented error", "message": err.Error()})
	}
}
