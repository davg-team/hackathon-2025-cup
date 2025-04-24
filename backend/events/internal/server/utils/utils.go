package utils

import (
	"crypto/rsa"
	"fmt"
	"os"

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
