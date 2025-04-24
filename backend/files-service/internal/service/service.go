package service

import (
	"context"
	"log/slog"
	"mime/multipart"

	"github.com/aws/aws-sdk-go-v2/aws"
	awsCfg "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/davg/files-service/internal/config"
)

type Service struct {
	logger   *slog.Logger
	S3Client *s3.Client
}

func NewService(logger *slog.Logger) *Service {
	log := logger.With(slog.String("service", "service"))
	cfg, err := awsCfg.LoadDefaultConfig(context.TODO())
	if err != nil {
		log.Error("failed to load default AWS config", err.Error())
	}
	s3Client := s3.NewFromConfig(cfg)
	log.Info("AWS S3 client created")

	return &Service{
		logger:   log,
		S3Client: s3Client,
	}
}

func (s *Service) UploadFile(ctx context.Context, file multipart.File, fileID string) error {
	// Set the S3 bucket and key
	cfg := config.Config().Bucket

	upload := &s3.PutObjectInput{
		Bucket: aws.String(cfg.Name),
		Key:    aws.String("files/" + fileID),
		Body:   file,
	}

	// Upload the file to S3
	_, err := s.S3Client.PutObject(ctx, upload)
	if err != nil {
		s.logger.Error("failed to upload file", err.Error())
		return err
	}

	s.logger.Info("file uploaded successfully", slog.String("fileID", fileID))
	return nil
}
