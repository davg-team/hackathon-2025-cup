package server

import (
	"net/http"
	"slices"

	"github.com/davg/applications-service/internal/domain/requests"
	"github.com/davg/applications-service/pkg/middlewares/authorization"
	"github.com/gin-gonic/gin"
)

type ApplicationRouter struct {
	router  *gin.RouterGroup
	service ApplicationService
}

func Register(router *gin.RouterGroup, service ApplicationService) {
	r := ApplicationRouter{
		router:  router,
		service: service,
	}
	r.init()
}

func (r *ApplicationRouter) GetApplication(ctx *gin.Context) {
	id := ctx.Param("id")

	application, err := r.service.Application(ctx, id)
	if err != nil {
		HandleError(ctx, err)
		return
	}

	ctx.JSON(200, application)
}

func (r *ApplicationRouter) GetApplications(ctx *gin.Context) {
	applicationStatus := ctx.Query("status")
	teamID := ctx.Query("team_id")
	eventID := ctx.Query("event_id")

	applications, err := r.service.Applications(ctx, applicationStatus, teamID, eventID)
	if err != nil {
		HandleError(ctx, err)
		return
	}

	if len(applications) == 0 {
		ctx.JSON(204, nil)
		return
	}

	ctx.JSON(200, applications)
}

func (r *ApplicationRouter) CreateApplication(ctx *gin.Context) {
	payload, err := authorization.FromContext(ctx)
	if err != nil {
		HandleError(ctx, err)
		return
	}

	var application requests.CreateApplicationRequest

	if err := ctx.ShouldBindJSON(&application); err != nil {
		HandleError(ctx, err)
		return
	}

	applicationID, err := r.service.CreateApplication(ctx, application, payload.ID, payload.Region)
	if err != nil {
		HandleError(ctx, err)
		return
	}

	ctx.JSON(201, gin.H{"id": applicationID})
}

func (r *ApplicationRouter) UpdateApplicationStatus(ctx *gin.Context) {
	payload, err := authorization.FromContext(ctx)
	if err != nil {
		HandleError(ctx, err)
		return
	}

	if !slices.Contains(payload.Roles, "fsp_staff") && !slices.Contains(payload.Roles, "fsp_region_staff") && !slices.Contains(payload.Roles, "fsp_region_head") {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	applicationID := ctx.Param("id")
	applicationStatus := ctx.Query("status")

	err = r.service.UpdateApplicationStatus(ctx, applicationID, applicationStatus)
	if err != nil {
		HandleError(ctx, err)
		return
	}

	ctx.JSON(200, gin.H{"status": "success"})
}

// TODO: think about JWT
func (r *ApplicationRouter) CreateTeamApplication(ctx *gin.Context) {
	payload, err := authorization.FromContext(ctx)
	if err != nil {
		HandleError(ctx, err)
		return
	}

	var application requests.CreateTeamApplicationRequest

	if err := ctx.ShouldBindJSON(&application); err != nil {
		HandleError(ctx, err)
		return
	}

	err = r.service.CreateTeamApplication(ctx, application, payload.ID)
	if err != nil {
		HandleError(ctx, err)
		return
	}

	ctx.JSON(201, gin.H{"status": "success"})
}

func (r *ApplicationRouter) GetTeamApplication(ctx *gin.Context) {
	id := ctx.Param("id")

	application, err := r.service.TeamApplication(ctx, id)
	if err != nil {
		HandleError(ctx, err)
		return
	}

	ctx.JSON(200, application)
}

func (r *ApplicationRouter) GetTeamApplications(ctx *gin.Context) {
	teamID := ctx.Query("team_id")
	applicantID := ctx.Query("user_id")

	applications, err := r.service.TeamApplications(ctx, teamID, applicantID)
	if err != nil {
		HandleError(ctx, err)
		return
	}

	ctx.JSON(200, applications)
}

func (r *ApplicationRouter) UpdateTeamApplication(ctx *gin.Context) {
	payload, err := authorization.FromContext(ctx)
	if err != nil {
		HandleError(ctx, err)
		return
	}

	applicationID := ctx.Param("id")
	applicationStatus := ctx.Query("status")

	err = r.service.UpdateTeamApplication(ctx, applicationID, applicationStatus, payload.ID)
	if err != nil {
		HandleError(ctx, err)
		return
	}

	ctx.JSON(200, gin.H{"status": "success"})
}

func (r *ApplicationRouter) init() {
	key := GetKey()
	router := r.router.Group("/applications")

	router.GET("/:id", r.GetApplication)
	router.GET("/", r.GetApplications)
	router.POST("/", authorization.MiddlwareJWT(key), r.CreateApplication)
	router.PATCH("/:id/status", authorization.MiddlwareJWT(key), r.UpdateApplicationStatus)

	teamRouter := router.Group("/team")
	teamRouter.POST("/", authorization.MiddlwareJWT(key), r.CreateTeamApplication)
	teamRouter.GET("/:id", r.GetTeamApplication)
	teamRouter.GET("/", r.GetTeamApplications)
	teamRouter.PATCH("/:id/status", authorization.MiddlwareJWT(key), r.UpdateTeamApplication)
}
