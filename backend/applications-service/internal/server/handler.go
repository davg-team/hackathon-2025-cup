package server

import (
	"github.com/davg/applications-service/internal/domain/requests"
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
	applicationStatus := ctx.Query("application_status")
	teamID := ctx.Query("team_id")

	applications, err := r.service.Applications(ctx, applicationStatus, teamID)
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
	var application requests.CreateApplicationRequest

	if err := ctx.ShouldBindJSON(&application); err != nil {
		HandleError(ctx, err)
		return
	}

	applicationID, err := r.service.CreateApplication(ctx, application)
	if err != nil {
		HandleError(ctx, err)
		return
	}

	ctx.JSON(201, gin.H{"id": applicationID})
}

func (r *ApplicationRouter) init() {
	router := r.router.Group("/applications")

	router.GET("/:id", r.GetApplication)
	router.GET("/", r.GetApplications)
	router.POST("/", r.CreateApplication)
}
