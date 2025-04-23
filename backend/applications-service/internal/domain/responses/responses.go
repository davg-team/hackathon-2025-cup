package responses

type Member struct {
	MemberID        string `json:"id"`
	MemberFirstName string `json:"first_name"`
	MemberLastName  string `json:"last_name"`
	MemberEmail     string `json:"email"`
	MemberAvatar    string `json:"avatar"`
}

type GetApplicationResponse struct {
	ApplicationID     string `json:"application_id"`
	EventID           string `json:"event_id"`
	ApplicationStatus string `json:"application_status"`
	TeamID            string `json:"team_id"`
	TeamName          string `json:"team_name"`
	CaptainID         string `json:"captain_id"`
	TeamType          string `json:"team_type"`
	CreatedAt         string `json:"created_at"`
	Members           any    `json:"members"`
}

type GetTeamApplicationResponse struct {
	ID               string `json:"id"`
	TeamID           string `json:"team_id"`
	ApplicantID      string `json:"applicant_id"`
	ApplicationState string `json:"application_state"`
	CreatedAt        string `json:"created_at"`
}
