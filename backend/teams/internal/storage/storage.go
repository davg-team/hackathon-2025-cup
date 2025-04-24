package storage

import (
	"github.com/davg/teams/internal/config"
	ydb "github.com/ydb-platform/gorm-driver"
	yc "github.com/ydb-platform/ydb-go-yc"
	"gorm.io/gorm"
)

type Storage struct {
	db *gorm.DB
}

func New() *Storage {
	cfg := config.Config().Storage

	db, err := gorm.Open(ydb.Open(cfg.Dsn, ydb.With(yc.WithInternalCA(), yc.WithServiceAccountKeyFileCredentials(cfg.PathToKey))), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	return &Storage{db: db}
}
