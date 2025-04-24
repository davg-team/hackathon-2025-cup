package stats

import (
	"context"
	"net/http"
	"strconv"

	"github.com/davg/analytics/internal/domain/schemas"
	"github.com/davg/analytics/internal/server/utils"
	"github.com/gin-gonic/gin"
)

type StatsService interface {
	OverallStats(ctx context.Context, region string) (*schemas.GeneralStats, error)
	GetTimeSeriesData(ctx context.Context, metric string, region string, from string, to string) (*schemas.TimeSeriesData, error)
	GetTopRegions(ctx context.Context, typ string, metric string, limit int) (*schemas.TopRegions, error)
}

type StatsRouter struct {
	router  *gin.RouterGroup
	service StatsService
}

func Register(router *gin.RouterGroup, service StatsService) {
	statsRouter := &StatsRouter{
		router:  router,
		service: service,
	}
	statsRouter.init()
}

func (r *StatsRouter) GetTeamOverallStatistics(ctx *gin.Context) {
	region := ctx.Query("region")

	stats, err := r.service.OverallStats(ctx, region)
	if err != nil {
		utils.HandleError(err, ctx)
		return
	}

	ctx.JSON(http.StatusOK, stats)
}

func (r *StatsRouter) GetTimeSeriesData(ctx *gin.Context) {
	metric := ctx.Query("metric")
	region := ctx.Query("region")
	from := ctx.Query("from")
	to := ctx.Query("to")

	data, err := r.service.GetTimeSeriesData(ctx, metric, region, from, to)
	if err != nil {
		utils.HandleError(err, ctx)
		return
	}

	ctx.JSON(http.StatusOK, data)
}

func (r *StatsRouter) GetTopRegions(ctx *gin.Context) {
	typ := ctx.Query("type")
	metric := ctx.Query("metric")
	limit := ctx.Query("limit")

	limitInt, err := strconv.Atoi(limit)
	if err != nil {
		utils.HandleError(err, ctx)
		return
	}

	data, err := r.service.GetTopRegions(ctx, typ, metric, limitInt)
	if err != nil {
		utils.HandleError(err, ctx)
		return
	}

	ctx.JSON(http.StatusOK, data)
}

func (r *StatsRouter) init() {
	group := r.router.Group("")
	group.GET("/summary", r.GetTeamOverallStatistics)
	group.GET("/time-series", r.GetTimeSeriesData)
	group.GET("/top", r.GetTopRegions)
}
