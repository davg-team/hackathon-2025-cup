package organizations

import (
	"context"
	"encoding/json"
	"log/slog"

	"github.com/davg/internal/domain/models"
	"github.com/davg/internal/domain/schemas"
)

type OrganizationStorage interface {
	Organizations(ctx context.Context) ([]models.Organization, error)
	Organization(ctx context.Context, id string) (*models.Organization, error)
	CreateOrganization(ctx context.Context, organization *schemas.OrganizationPreCreateSchema) error
	UpdateOrganization(ctx context.Context, id string, organization *schemas.OrganizationPreUpdateSchema) error
	UpdateDescription(ctx context.Context, id string, description string) error
}

type OrganizationService struct {
	storage OrganizationStorage
	log     *slog.Logger
}

func New(storage OrganizationStorage, log *slog.Logger) *OrganizationService {
	log = log.With(slog.String("service", "events"))
	return &OrganizationService{storage: storage, log: log}
}

func (s *OrganizationService) Organizations(ctx context.Context) ([]models.Organization, error) {
	const op = "Organizations"

	log := s.log.With(slog.String("op", op))
	log.Info("getting organizations")

	organizations, err := s.storage.Organizations(ctx)
	if err != nil {
		log.Error(err.Error())
		return nil, err
	}

	log.Info("got organizations")

	return organizations, nil
}

func (s *OrganizationService) Organization(ctx context.Context, id string) (*models.Organization, error) {
	const op = "Organization"

	log := s.log.With(slog.String("op", op))
	log.Info("getting organization")

	organization, err := s.storage.Organization(ctx, id)
	if err != nil {
		log.Error(err.Error())
		return nil, err
	}

	log.Info("got organization")

	return organization, nil
}

func (s *OrganizationService) CreateOrganization(ctx context.Context, organization *schemas.Organization) error {
	const op = "CreateOrganization"

	log := s.log.With(slog.String("op", op))
	log.Info("creating organization")

	managerString, err := json.Marshal(organization.Managers)
	if err != nil {
		log.Error(err.Error())
		return err
	}

	organizationModel := &schemas.OrganizationPreCreateSchema{
		ID:       organization.ID,
		District: organization.District,
		Managers: string(managerString),
		Region:   organization.Region,
		Email:    organization.Email,
	}

	if err := s.storage.CreateOrganization(ctx, organizationModel); err != nil {
		log.Error(err.Error())
		return err
	}

	log.Info("created organization")

	return nil
}

func (s *OrganizationService) UpdateOrganization(ctx context.Context, id string, organization *schemas.Organization) error {
	const op = "UpdateOrganization"

	log := s.log.With(slog.String("op", op))
	log.Info("updating organization")

	managerString, err := json.Marshal(organization.Managers)
	if err != nil {
		log.Error(err.Error())
		return err
	}

	organizationModel := &schemas.OrganizationPreUpdateSchema{
		District: organization.District,
		Managers: string(managerString),
		Region:   organization.Region,
		Email:    organization.Email,
	}

	if err := s.storage.UpdateOrganization(ctx, id, organizationModel); err != nil {
		log.Error(err.Error())
		return err
	}

	log.Info("updated organization")

	return nil
}

func (s *OrganizationService) UpdateDescription(ctx context.Context, id string, description string) error {
	const op = "UpdateDescription"

	log := s.log.With(slog.String("op", op))
	log.Info("updating description")

	if err := s.storage.UpdateDescription(ctx, id, description); err != nil {
		log.Error(err.Error())
		return err
	}

	log.Info("updated description")

	return nil
}
