package config

import (
	"errors"
	"fmt"
	"log"
	"os"

	"github.com/ilyakaznacheev/cleanenv"
)

const (
	EnvLocal = "local"
	EnvDev   = "dev"
	EnvProd  = "prod"
)

var cfg config

type config struct {
	EnvType      string             `yaml:"env_type"`
	Server       serverConfig       `yaml:"server"`
	Storage      storageConfig      `yaml:"storage"`
	UsersService usersServiceConfig `yaml:"users_service"`
	TeamsService teamsServiceConfig `yaml:"teams_service"`
}

type usersServiceConfig struct {
	URL string `yaml:"url"`
}

type teamsServiceConfig struct {
	URL string `yaml:"url"`
}

type serverConfig struct {
	Port int `yaml:"port"`
}

type storageConfig struct {
	DSN       string `yaml:"dsn"`
	PathToKey string `yaml:"path_to_key"`
}

// Cfg return copy of cfg (line 18)
func Config() config {
	return cfg
}

func init() {
	envType := getEnvType()
	path := getConfigFilePath(envType)
	cleanenv.ReadConfig(path, &cfg)
}

func getConfigFilePath(envType string) string {
	path := fmt.Sprintf("./config/%s.yaml", envType)
	if _, err := os.Stat(path); errors.Is(err, os.ErrNotExist) {
		log.Fatalf("%s file not found", path)
	}
	return path
}

func getEnvType() string {
	envType := os.Getenv("ENV_TYPE")
	if envType == "" {
		log.Fatal("Empty ENV_TYPE variable")
	}
	if envType != EnvProd {
		log.Printf("!!! Using %s env type. Not for production !!!", envType)
		log.Printf("!!! Using %s env type. Not for production !!!", envType)
		log.Printf("!!! Using %s env type. Not for production !!!", envType)
	}
	return envType
}
