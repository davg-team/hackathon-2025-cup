package responses

type Member struct {
	MemberID   string `json:"member_id"`
	MemberName string `json:"member_name"`
}

type GetApplicationResponse struct {
	ApplicationID     string `json:"application_id"`
	EventID           string `json:"event_id"`
	ApplicationStatus string `json:"application_status"`
	TeamID            string `json:"team_id"`
	TeamType          string `json:"team_type"`
	Members           any    `json:"members"`
}
