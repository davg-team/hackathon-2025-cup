package events

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"slices"
	"strconv"

	"github.com/davg/events/internal/domain/models"
	"github.com/davg/events/internal/domain/schemas"
	"github.com/davg/events/internal/server/utils"
	service "github.com/davg/events/internal/service/events"
	"github.com/davg/events/pkg/middlewares/authorization"
	"github.com/gin-gonic/gin"
)

type EventsService interface {
	CreateEvent(ctx context.Context, event schemas.EventPOSTSchema, organizationID string) error
	GetEventsWithFilters(ctx context.Context, organizationID, status, dateFilter, disciplineFilter, typeFilter string, maxAge, minAge int) ([]models.Event, error)
	GetEventByID(ctx context.Context, id string) (models.Event, error)
	UpdateEventStatus(ctx context.Context, id string, status string, message string) error
	DeleteEvent(ctx context.Context, id string) error
}

type EventsRouter struct {
	router  *gin.RouterGroup
	service EventsService
}

func Register(router *gin.RouterGroup, service EventsService) {
	r := EventsRouter{router: router, service: service}
	r.init()
}

func (r *EventsRouter) createEvent(c *gin.Context) {
	payload, err := authorization.FromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	fmt.Println(payload.Roles)
	if !slices.Contains(payload.Roles, "root") && !slices.Contains(payload.Roles, "fsp_staff") && !slices.Contains(payload.Roles, "fsp_region_staff") && !slices.Contains(payload.Roles, "fsp_region_head") {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	var event schemas.EventPOSTSchema
	if err := c.ShouldBindJSON(&event); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := r.service.CreateEvent(c, event, payload.RegionID); err != nil {
		handleError(err, c)
		return
	}

	c.Status(http.StatusCreated)
}

func (r *EventsRouter) getEventsWithFilters(c *gin.Context) {
	status := c.Query("status")
	organizationID := c.Query("organization_id")
	dateFilter := c.Query("date_filter")
	maxAgeFilter, _ := strconv.Atoi(c.Query("max_age_filter"))
	minAgeFilter, _ := strconv.Atoi(c.Query("min_age_filter"))
	disciplineFilter := c.Query("discipline_filter")
	typeFilter := c.Query("type_filter")
	events, err := r.service.GetEventsWithFilters(c, organizationID, status, dateFilter, disciplineFilter, typeFilter, maxAgeFilter, minAgeFilter)
	if err != nil {
		handleError(err, c)
		return
	}

	c.JSON(http.StatusOK, events)
}

func (r *EventsRouter) getEventByID(c *gin.Context) {
	id := c.Param("id")
	event, err := r.service.GetEventByID(c, id)
	if err != nil {
		handleError(err, c)
		return
	}

	c.JSON(http.StatusOK, event)
}

func (r *EventsRouter) updateEventStatus(c *gin.Context) {

	var status schemas.UpdateEventStatus
	id := c.Param("id")
	if err := c.ShouldBindJSON(&status); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := checkStatus(status.Status); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := r.service.UpdateEventStatus(c, id, status.Status, status.Message); err != nil {
		handleError(err, c)
		return
	}

	c.Status(http.StatusOK)
}

func (r *EventsRouter) deleteEvent(c *gin.Context) {
	payload, err := authorization.FromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	if !slices.Contains(payload.Roles, "root") && !slices.Contains(payload.Roles, "fsp_staff") {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	id := c.Param("id")
	if err := r.service.DeleteEvent(c, id); err != nil {
		handleError(err, c)
		return
	}

	c.Status(http.StatusOK)
}

func (r *EventsRouter) init() {
	key := utils.GetKey()
	group := r.router.Group("/events")

	group.POST("/", authorization.MiddlwareJWT(key), r.createEvent)
	group.GET("/", r.getEventsWithFilters)
	group.GET("/:id", r.getEventByID)
	group.PUT("/:id", authorization.MiddlwareJWT(key), r.updateEventStatus)
	group.DELETE("/:id", authorization.MiddlwareJWT(key), r.deleteEvent)
}

func checkStatus(status string) error {
	if status != "verified" && status != "declined" && status != "on_verification" && status != "published" && status != "draft" {
		return fmt.Errorf("%w: %s", service.ErrBadRequest, "invalid status")
	}
	return nil
}

func handleError(err error, ctx *gin.Context) {
	if errors.Is(err, service.ErrBadRequest) {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	if errors.Is(err, service.ErrNotFound) {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
	}
	if errors.Is(err, service.ErrInternalServer) {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
}
