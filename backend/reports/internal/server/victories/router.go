package victories

import (
	"context"

	"github.com/davg/internal/domain"
	"github.com/davg/internal/domain/requests"
	"github.com/davg/internal/server/utils"

	"github.com/gin-gonic/gin"
)

type ResultsService interface {
	Results(ctx context.Context) ([]domain.Result, error)
	UsersResults(ctx context.Context, userID string) ([]domain.Result, error)
	TeamsResults(ctx context.Context, teamID string) ([]domain.Result, error)
	EventsResults(ctx context.Context, eventID string) ([]domain.Result, error)
	Result(ctx context.Context, id string) (*domain.Result, error)
	CreateResult(ctx context.Context, result *requests.ResultPost) error
	UpdateResult(ctx context.Context, id string, result *requests.ResultPost) error
	DeleteResult(ctx context.Context, id string) error
}

type ResultsRouter struct {
	router  *gin.RouterGroup
	service ResultsService
}

func Register(RouterGroup *gin.RouterGroup, service ResultsService) *ResultsRouter {
	router := ResultsRouter{
		router:  RouterGroup,
		service: service,
	}

	router.init()

	return &router
}

func (r *ResultsRouter) Results(ctx *gin.Context) {
	results, err := r.service.Results(ctx)
	if err != nil {
		utils.HandleError(err, ctx)
		return
	}

	ctx.JSON(200, results)
}

func (r *ResultsRouter) UsersResults(ctx *gin.Context) {
	userID := ctx.Param("id")
	results, err := r.service.UsersResults(ctx, userID)
	if err != nil {
		utils.HandleError(err, ctx)
		return
	}

	ctx.JSON(200, results)
}

func (r *ResultsRouter) TeamsResults(ctx *gin.Context) {
	teamID := ctx.Param("id")
	results, err := r.service.TeamsResults(ctx, teamID)
	if err != nil {
		utils.HandleError(err, ctx)
		return
	}

	ctx.JSON(200, results)
}

func (r *ResultsRouter) EventsResults(ctx *gin.Context) {
	eventID := ctx.Param("id")
	results, err := r.service.EventsResults(ctx, eventID)
	if err != nil {
		utils.HandleError(err, ctx)
		return
	}

	ctx.JSON(200, results)
}

func (r *ResultsRouter) Result(ctx *gin.Context) {
	id := ctx.Param("id")
	result, err := r.service.Result(ctx, id)
	if err != nil {
		utils.HandleError(err, ctx)
		return
	}

	ctx.JSON(200, result)
}

func (r *ResultsRouter) CreateResult(ctx *gin.Context) {
	var result requests.ResultPost
	if err := ctx.ShouldBindJSON(&result); err != nil {
		ctx.JSON(400, err)
		return
	}

	if err := r.service.CreateResult(ctx, &result); err != nil {
		utils.HandleError(err, ctx)
		return
	}

	ctx.JSON(200, "result created")
}

func (r *ResultsRouter) UpdateResult(ctx *gin.Context) {
	id := ctx.Param("id")

	var result requests.ResultPost
	if err := ctx.ShouldBindJSON(&result); err != nil {
		ctx.JSON(400, err)
		return
	}

	if err := r.service.UpdateResult(ctx, id, &result); err != nil {
		utils.HandleError(err, ctx)
		return
	}

	ctx.JSON(200, "result updated")
}

func (r *ResultsRouter) DeleteResult(ctx *gin.Context) {
	id := ctx.Param("id")

	if err := r.service.DeleteResult(ctx, id); err != nil {
		utils.HandleError(err, ctx)
		return
	}

	ctx.JSON(200, "result deleted")
}

func (r *ResultsRouter) init() {
	group := r.router.Group("/results")

	group.GET("/", r.Results)
	group.GET("/users/:id", r.UsersResults)
	group.GET("/teams/:id", r.TeamsResults)
	group.GET("/events/:id", r.EventsResults)
	group.GET("/:id", r.Result)
	group.POST("/", r.CreateResult)
	group.PUT("/:id", r.UpdateResult)
	group.DELETE("/:id", r.DeleteResult)
}
