package teamsevents

import (
	"context"
	"fmt"

	"github.com/davg/teams/internal/domain/models"
	"github.com/davg/teams/internal/domain/schemas"
	"github.com/gin-gonic/gin"
)

type TeamsEventsService interface {
	TeamEvents(ctx context.Context, id string) ([]models.TeamEvent, error)
	TeamsEvents(ctx context.Context) ([]models.TeamEvent, error)
	CreateTeamEvent(ctx context.Context, event models.TeamEvent) error
	UpdateTeamEvent(ctx context.Context, team_id string, event_id string, event models.TeamEvent) error
	DeleteTeamEvent(ctx context.Context, team_id string, event_id string) error
	DeleteTeamEvents(ctx context.Context, team_id string) error
}

type TeamsEventsRouter struct {
	route       *gin.RouterGroup
	teamsEvents TeamsEventsService
}

func Register(router *gin.RouterGroup, teamsEvents TeamsEventsService) {
	r := TeamsEventsRouter{route: router, teamsEvents: teamsEvents}
	r.init()
}

func (r *TeamsEventsRouter) TeamEvents(ctx *gin.Context) {
	id := ctx.Param("id")
	events, err := r.teamsEvents.TeamEvents(ctx, id)
	if err != nil {
		ctx.JSON(500, err)
		return
	}
	ctx.JSON(200, events)
}

func (r *TeamsEventsRouter) TeamsEvents(ctx *gin.Context) {
	events, err := r.teamsEvents.TeamsEvents(ctx)
	if err != nil {
		ctx.JSON(500, err)
		return
	}
	ctx.JSON(200, events)
}

func (r *TeamsEventsRouter) CreateTeamsEvent(ctx *gin.Context) {
	var events schemas.TeamsEventPostSchema

	if err := ctx.BindJSON(&events); err != nil {
		ctx.JSON(400, err)
		return
	}
	if len(events.Teams) == 0 {
		ctx.JSON(400, fmt.Errorf("teams is empty"))
		return
	}
	for _, extractedEvent := range events.Teams {
		event := models.TeamEvent{
			EventID:         events.EventID,
			EventTitle:      events.EventTitle,
			EventDiscipline: events.EventDiscipline,
			EventType:       events.EventType,
			TeamID:          extractedEvent.TeamID,
			Placement:       extractedEvent.Placement,
		}

		err := r.teamsEvents.CreateTeamEvent(ctx, event)
		if err != nil {
			ctx.JSON(500, err)
			return
		}
	}

	ctx.JSON(200, nil)
}

func (r *TeamsEventsRouter) UpdateTeamEvent(ctx *gin.Context) {
	id := ctx.Param("id")
	var event models.TeamEvent
	if err := ctx.BindJSON(&event); err != nil {
		ctx.JSON(400, err)
		return
	}
	err := r.teamsEvents.UpdateTeamEvent(ctx, id, event.EventID, event)
	if err != nil {
		ctx.JSON(500, err)
		return
	}
	ctx.JSON(200, nil)
}

func (r *TeamsEventsRouter) DeleteTeamEvent(ctx *gin.Context) {
	id := ctx.Param("id")
	err := r.teamsEvents.DeleteTeamEvent(ctx, id, ctx.Query("event_id"))
	if err != nil {
		ctx.JSON(500, err)
		return
	}
	ctx.JSON(200, nil)
}

func (r *TeamsEventsRouter) DeleteTeamEvents(ctx *gin.Context) {
	id := ctx.Query("id")
	err := r.teamsEvents.DeleteTeamEvents(ctx, id)
	if err != nil {
		ctx.JSON(500, err)
		return
	}
	ctx.JSON(200, nil)
}

func (r *TeamsEventsRouter) init() {
	group := r.route.Group("/teams-events")

	group.GET("/:id", r.TeamEvents)
	group.GET("/", r.TeamsEvents)
	group.POST("/", r.CreateTeamsEvent)
	group.PUT("/:id", r.UpdateTeamEvent)
	group.DELETE("/:id", r.DeleteTeamEvent)
	group.DELETE("/", r.DeleteTeamEvents)
}
