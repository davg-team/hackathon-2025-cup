package organizations

import (
	"context"

	"github.com/davg/internal/domain/models"
	"github.com/davg/internal/domain/schemas"
	"github.com/gin-gonic/gin"
)

type OrganizationsService interface {
	Organizations(ctx context.Context) ([]models.Organization, error)
	Organization(ctx context.Context, id string) (*models.Organization, error)
	CreateOrganization(ctx context.Context, organization *schemas.Organization) error
	UpdateOrganization(ctx context.Context, id string, organization *schemas.Organization) error
	UpdateDescription(ctx context.Context, id string, description string) error
}
type OrganizationsRouter struct {
	router  *gin.RouterGroup
	service OrganizationsService
}

func Register(RouterGroup *gin.RouterGroup, service OrganizationsService) *OrganizationsRouter {
	router := OrganizationsRouter{
		router:  RouterGroup,
		service: service,
	}

	router.init()

	return &router
}

func (r *OrganizationsRouter) Organizations(ctx *gin.Context) {
	organizations, err := r.service.Organizations(ctx)
	if err != nil {
		ctx.JSON(500, err.Error())
		return
	}

	ctx.JSON(200, organizations)
}

func (r *OrganizationsRouter) Organization(ctx *gin.Context) {
	id := ctx.Param("id")

	organization, err := r.service.Organization(ctx, id)
	if err != nil {
		ctx.JSON(500, err.Error())
		return
	}

	ctx.JSON(200, organization)
}

func (r *OrganizationsRouter) CreateOrganization(ctx *gin.Context) {
	var organization schemas.Organization

	if err := ctx.ShouldBindJSON(&organization); err != nil {
		ctx.JSON(400, err.Error())
		return
	}

	if err := r.service.CreateOrganization(ctx, &organization); err != nil {
		ctx.JSON(500, err.Error())
		return
	}

	ctx.JSON(200, organization)
}

func (r *OrganizationsRouter) UpdateOrganization(ctx *gin.Context) {
	var organization schemas.Organization
	id := ctx.Param("id")

	if err := ctx.BindJSON(&organization); err != nil {
		ctx.JSON(400, err.Error())
		return
	}

	if err := r.service.UpdateOrganization(ctx, id, &organization); err != nil {
		ctx.JSON(500, err.Error())
		return
	}

	ctx.JSON(200, organization)
}

func (r *OrganizationsRouter) UpdateDescription(ctx *gin.Context) {
	id := ctx.Param("id")

	var descriptionSchema schemas.OrganizationDescriptionUpdateSchema

	if err := ctx.BindJSON(&descriptionSchema); err != nil {
		ctx.JSON(400, err.Error())
		return
	}

	if err := r.service.UpdateDescription(ctx, id, descriptionSchema.Description); err != nil {
		ctx.JSON(500, err.Error())
		return
	}

	ctx.JSON(200, gin.H{"message": "Description updated successfully"})
}

func (r *OrganizationsRouter) init() {
	group := r.router.Group("/organizations")

	group.GET("/", r.Organizations)
	group.GET("/:id", r.Organization)
	group.POST("/", r.CreateOrganization)
	group.PUT("/:id", r.UpdateOrganization)
	group.PUT("/:id/description", r.UpdateDescription)
}
