package storage

import (
	"context"
	"encoding/json"

	"github.com/davg/internal/domain/models"
	"github.com/davg/internal/domain/schemas"
	"gorm.io/datatypes"
)

func (s *Storage) Organizations(ctx context.Context) ([]models.Organization, error) {
	var organizations []models.Organization
	if err := s.db.Table("organizations").Find(&organizations).Error; err != nil {
		return nil, err
	}

	return organizations, nil
}

func (s *Storage) Organization(ctx context.Context, id string) (*models.Organization, error) {
	var organization models.Organization
	if err := s.db.Table("organizations").Model(&models.Organization{}).Where("id = ?", id).First(&organization).Error; err != nil {
		return nil, err
	}

	return &organization, nil
}

func (s *Storage) CreateOrganization(ctx context.Context, org *schemas.OrganizationPreCreateSchema) error {
	var managers datatypes.JSON
	if err := json.Unmarshal([]byte(org.Managers), &managers); err != nil {
		return err
	}

	model := &models.Organization{
		ID:       org.ID,
		District: org.District,
		Region:   org.Region,
		Email:    org.Email,
		Manager:  managers,
	}

	return s.db.Table("organizations").Create(model).Error
}

func (s *Storage) UpdateOrganization(ctx context.Context, id string, organization *schemas.OrganizationPreUpdateSchema) error {
	if err := s.db.Table("organizations").Where("id = ?", id).First(organization).Error; err != nil {
		return err
	}
	return s.db.Table("organizations").Model(&models.Organization{}).Where("id = ?", id).Update("district", organization.District).Update("manager", organization.Managers).Update("region", organization.Region).Update("email", organization.Email).Error
}

func (s *Storage) UpdateDescription(ctx context.Context, id string, description string) error {
	return s.db.Table("organizations").Model(&models.Organization{}).Where("id = ?", id).Update("description", description).Error
}
