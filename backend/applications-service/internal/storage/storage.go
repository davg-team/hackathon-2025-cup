package storage

import (
	"github.com/davg/applications-service/internal/config"
	ydb "github.com/ydb-platform/gorm-driver"
	yc "github.com/ydb-platform/ydb-go-yc"
	"gorm.io/gorm"
)

type Storage struct {
	db *gorm.DB
}

func New() *Storage {
	cfg := config.Config().Storage

	db, err := gorm.Open(ydb.Open(cfg.DSN, ydb.With(yc.WithInternalCA(), yc.WithServiceAccountKeyFileCredentials(cfg.PathToKey))), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	return &Storage{db: db}
}
