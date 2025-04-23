package victories

import (
	"context"

	"github.com/davg/internal/domain"
	"github.com/davg/internal/domain/requests"
	"github.com/davg/internal/server/utils"

	"github.com/gin-gonic/gin"
)

type VictoriesService interface {
	Victories(ctx context.Context) ([]domain.Victory, error)
	UsersVictories(ctx context.Context, userID string) ([]domain.Victory, error)
	TeamsVictories(ctx context.Context, teamID string) ([]domain.Victory, error)
	EventsVictories(ctx context.Context, eventID string) ([]domain.Victory, error)
	Victory(ctx context.Context, id string) (*domain.Victory, error)
	CreateVictory(ctx context.Context, victory *requests.VictoryPost) error
	UpdateVictory(ctx context.Context, id string, victory *requests.VictoryPost) error
	DeleteVictory(ctx context.Context, id string) error
}

type VictoriesRouter struct {
	router  *gin.RouterGroup
	service VictoriesService
}

func Register(RouterGroup *gin.RouterGroup, service VictoriesService) *VictoriesRouter {
	router := VictoriesRouter{
		router:  RouterGroup,
		service: service,
	}

	router.init()

	return &router
}

func (r *VictoriesRouter) Victories(ctx *gin.Context) {
	victories, err := r.service.Victories(ctx)
	if err != nil {
		utils.HandleError(err, ctx)
		return
	}

	ctx.JSON(200, victories)
}

func (r *VictoriesRouter) UsersVictories(ctx *gin.Context) {
	userID := ctx.Param("id")
	victories, err := r.service.UsersVictories(ctx, userID)
	if err != nil {
		utils.HandleError(err, ctx)
		return
	}

	ctx.JSON(200, victories)
}

func (r *VictoriesRouter) TeamsVictories(ctx *gin.Context) {
	teamID := ctx.Param("id")
	victories, err := r.service.TeamsVictories(ctx, teamID)
	if err != nil {
		utils.HandleError(err, ctx)
		return
	}

	ctx.JSON(200, victories)
}

func (r *VictoriesRouter) EventsVictories(ctx *gin.Context) {
	eventID := ctx.Param("id")
	victories, err := r.service.EventsVictories(ctx, eventID)
	if err != nil {
		utils.HandleError(err, ctx)
		return
	}

	ctx.JSON(200, victories)
}

func (r *VictoriesRouter) Victory(ctx *gin.Context) {
	id := ctx.Param("id")
	victory, err := r.service.Victory(ctx, id)
	if err != nil {
		utils.HandleError(err, ctx)
		return
	}

	ctx.JSON(200, victory)
}

func (r *VictoriesRouter) CreateVictory(ctx *gin.Context) {
	var victory requests.VictoryPost
	if err := ctx.ShouldBindJSON(&victory); err != nil {
		ctx.JSON(400, err)
		return
	}

	if err := r.service.CreateVictory(ctx, &victory); err != nil {
		utils.HandleError(err, ctx)
		return
	}

	ctx.JSON(200, "victory created")
}

func (r *VictoriesRouter) UpdateVictory(ctx *gin.Context) {
	id := ctx.Param("id")

	var victory requests.VictoryPost
	if err := ctx.ShouldBindJSON(&victory); err != nil {
		ctx.JSON(400, err)
		return
	}

	if err := r.service.UpdateVictory(ctx, id, &victory); err != nil {
		utils.HandleError(err, ctx)
		return
	}

	ctx.JSON(200, "victory updated")
}

func (r *VictoriesRouter) DeleteVictory(ctx *gin.Context) {
	id := ctx.Param("id")

	if err := r.service.DeleteVictory(ctx, id); err != nil {
		utils.HandleError(err, ctx)
		return
	}

	ctx.JSON(200, "victory deleted")
}

func (r *VictoriesRouter) init() {
	group := r.router.Group("/victories")

	group.GET("/", r.Victories)
	group.GET("/users/:id", r.UsersVictories)
	group.GET("/teams/:id", r.TeamsVictories)
	group.GET("/events/:id", r.EventsVictories)
	group.GET("/:id", r.Victory)
	group.POST("/", r.CreateVictory)
	group.PUT("/:id", r.UpdateVictory)
	group.DELETE("/:id", r.DeleteVictory)
}
