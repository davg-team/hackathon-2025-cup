package stats

import (
	"context"
	"encoding/json"
	"errors"
	"log/slog"
	"sort"
	"time"

	"github.com/davg/analytics/internal/domain/schemas"
)

type Service struct {
	log *slog.Logger
}

func New(log *slog.Logger) *Service {
	log = log.With("service", "stats")
	return &Service{
		log: log,
	}
}

func (s *Service) OverallStats(ctx context.Context, region string) (*schemas.GeneralStats, error) {
	const op = "stats.GeneralStats"

	log := s.log.With("op", op)
	log.Info("getting general stats")

	var stats schemas.GeneralStats

	log.Debug("getting users data")
	users, err := GetUsersData(ctx, log, region, "")
	if err != nil {
		return nil, err
	}
	stats.TotalUsers = int16(len(users))

	new_users := 0
	for _, user := range users {
		if user.Created.After(time.Now().Add(-time.Hour * 24 * 30)) {
			new_users++
		}
	}
	stats.NewUsers = int16(new_users)

	log.Debug("got users data", "count", len(users))

	log.Debug("getting events data")
	events, err := GetEventsData(ctx, log, "", region, "")
	if err != nil {
		return nil, err
	}
	stats.TotalEvents = int16(len(events))
	log.Debug("got events data", "count", len(events))

	last_30d := time.Now().Add(-time.Hour * 24 * 30)
	stats.EventsLast30d = int16(len(events))
	for _, event := range events {
		if event.StartDate.After(last_30d) {
			stats.EventsLast30d++
		}
	}

	log.Debug("getting applications data")
	apps, err := GetApplicationsData(ctx, log, region, "", "")
	if err != nil {
		return nil, err
	}
	stats.TotalApplications = int16(len(apps))
	log.Debug("got applications data", "count", len(apps))

	last_30d = time.Now().Add(-time.Hour * 24 * 30)
	stats.ApplicationsLast30d = int16(len(apps))
	for _, app := range apps {
		if app.Date.After(last_30d) {
			stats.ApplicationsLast30d++
		}
	}

	return &stats, nil
}

func (s *Service) GetTimeSeriesData(ctx context.Context, metric string, region string, from string, to string) (*schemas.TimeSeriesData, error) {
	const op = "stats.TimeSeriesData"

	log := s.log.With("op", op)
	log.Info("getting time-series data")

	var data schemas.TimeSeriesData

	switch metric {
	case "applications":
		apps, err := GetApplicationsData(ctx, log, region, from, to)
		if err != nil {
			return nil, err
		}
		data.Series = make([]schemas.TimeSeriesPoint, len(apps))
		for i, app := range apps {
			data.Series[i] = schemas.TimeSeriesPoint{
				Timestamp: app.Date,
				Value:     int16(1),
			}
		}
	case "events":
		events, err := GetEventsData(ctx, log, "", from, to)
		if err != nil {
			return nil, err
		}
		data.Series = make([]schemas.TimeSeriesPoint, len(events))
		for i, event := range events {
			data.Series[i] = schemas.TimeSeriesPoint{
				Timestamp: event.StartDate,
				Value:     int16(1),
			}
		}
	default:
		return nil, errors.New("unsupported metric")
	}

	return &data, nil
}

func (s *Service) GetTopRegions(ctx context.Context, typ string, metric string, limit int) (*schemas.TopRegions, error) {
	const op = "stats.TopRegions"

	log := s.log.With("op", op)
	log.Info("getting top regions")

	var topRegions schemas.TopRegions

	switch typ {
	case "regions":
		switch metric {
		case "users":
			users, err := GetUsersData(ctx, log, "", "")
			log.Debug("got users data", "count", len(users))
			if err != nil {
				return nil, err
			}
			regionUsers := make(map[string]int16)
			for _, user := range users {
				region := user.RegionID
				if _, ok := regionUsers[region]; !ok {
					regionUsers[region] = 0
				}
				regionUsers[region]++
			}
			topRegions.Regions = make([]schemas.Region, 0)
			for region, count := range regionUsers {
				topRegions.Regions = append(topRegions.Regions, schemas.Region{
					Name:  region,
					Count: count,
				})
			}
			sort.Slice(topRegions.Regions, func(i, j int) bool {
				return topRegions.Regions[i].Count > topRegions.Regions[j].Count
			})
			if len(topRegions.Regions) > limit {
				topRegions.Regions = topRegions.Regions[:limit]
			} else {
				limit = len(topRegions.Regions)
			}

		case "events":
			events, err := GetEventsData(ctx, log, "", "", "")
			if err != nil {
				return nil, err
			}
			regionEvents := make(map[string]int16)
			for _, event := range events {
				regions := make([]string, 0)
				json.Unmarshal(event.Regions, &regions)

				for _, r := range regions {
					if _, ok := regionEvents[r]; !ok {
						regionEvents[r] = 0
					}
					regionEvents[r]++
				}

			}
			topRegions.Regions = make([]schemas.Region, 0)
			for region, count := range regionEvents {
				topRegions.Regions = append(topRegions.Regions, schemas.Region{
					Name:  region,
					Count: count,
				})
			}
			sort.Slice(topRegions.Regions, func(i, j int) bool {
				return topRegions.Regions[i].Count > topRegions.Regions[j].Count
			})
			if len(topRegions.Regions) > limit {
				topRegions.Regions = topRegions.Regions[:limit]
			} else {
				for i := len(topRegions.Regions); i < limit; i++ {
					topRegions.Regions = append(topRegions.Regions, schemas.Region{
						Name:  "",
						Count: 0,
					})
				}
			}
		default:
			return nil, errors.New("unsupported metric")
		}
	default:
		return nil, errors.New("unsupported type")
	}

	return &topRegions, nil
}
