package teams

import (
	"context"
	"net/http"
	"slices"

	"github.com/davg/teams/internal/domain/models"
	"github.com/davg/teams/internal/domain/schemas"
	"github.com/davg/teams/internal/server/utils"
	"github.com/davg/teams/pkg/middlewares/authorization"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type TeamsService interface {
	Teams(ctx context.Context, fspID, user_id string) ([]models.Team, error)
	Team(ctx context.Context, id string) (models.Team, error)
	CreateTeam(ctx context.Context, id string, fspID string, team schemas.TeamPOSTSchema) error
	UpdateTeam(ctx context.Context, id string, team schemas.TeamPUTSchema) error
	DeleteTeam(ctx context.Context, id string) error
}

type TeamsRouter struct {
	router *gin.RouterGroup
	teams  TeamsService
}

func Register(router *gin.RouterGroup, teams TeamsService) {
	r := TeamsRouter{router: router, teams: teams}
	r.init()
}

func (r *TeamsRouter) Teams(ctx *gin.Context) {
	user_id := ctx.Query("user_id")

	fspID := ctx.Query("fsp_id")
	teams, err := r.teams.Teams(ctx, fspID, user_id)
	if err != nil {
		ctx.JSON(500, err)
		return
	}
	ctx.JSON(200, teams)
}

func (r *TeamsRouter) Team(ctx *gin.Context) {
	id := ctx.Param("id")
	team, err := r.teams.Team(ctx, id)
	if err != nil {
		ctx.JSON(500, err)
		return
	}
	ctx.JSON(200, team)
}

func (r *TeamsRouter) UpdateTeam(ctx *gin.Context) {
	id := ctx.Param("id")

	var team schemas.TeamPUTSchema

	if err := ctx.BindJSON(&team); err != nil {
		ctx.JSON(400, err)
		return
	}

	err := r.teams.UpdateTeam(ctx, id, team)
	if err != nil {
		ctx.JSON(500, err)
		return
	}
	ctx.JSON(200, nil)
}

func (r *TeamsRouter) CreateTeam(ctx *gin.Context) {
	payload, err := authorization.FromContext(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	if payload.RegionID == "" {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	if !(slices.Contains(payload.Roles, "fsp_region_staff") || slices.Contains(payload.Roles, "fsp_region_head") || slices.Contains(payload.Roles, "fsp_staff") || slices.Contains(payload.Roles, "root")) {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	fsp_id := payload.RegionID
	id := uuid.NewString()

	var team schemas.TeamPOSTSchema

	if err := ctx.BindJSON(&team); err != nil {
		ctx.JSON(400, err)
		return
	}
	err = r.teams.CreateTeam(ctx, id, fsp_id, team)
	if err != nil {
		ctx.JSON(500, err)
		return
	}
	ctx.JSON(200, nil)
}

func (r *TeamsRouter) DeleteTeam(ctx *gin.Context) {
	id := ctx.Param("id")
	err := r.teams.DeleteTeam(ctx, id)
	if err != nil {
		ctx.JSON(500, err)
		return
	}
	ctx.JSON(200, nil)
}

func (r *TeamsRouter) init() {
	key := utils.GetKey()
	group := r.router.Group("/teams")

	group.GET("/", r.Teams)
	group.GET("/:id", r.Team)
	group.POST("/", authorization.MiddlwareJWT(key), r.CreateTeam)
	group.PUT("/:id", authorization.MiddlwareJWT(key), r.UpdateTeam)
	group.DELETE("/:id", r.DeleteTeam)

}
