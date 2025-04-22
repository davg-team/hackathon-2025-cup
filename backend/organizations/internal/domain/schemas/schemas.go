package schemas

type Organization struct {
	ID          string   `json:"id"`
	District    string   `json:"district"`
	Region      string   `json:"region"`
	Description string   `json:"description"`
	Managers    []string `json:"managers"`
	Email       string   `json:"email"`
}

type OrganizationPreUpdateSchema struct {
	District string `json:"district"`
	Region   string `json:"region"`
	Managers string `json:"managers"`
	Email    string `json:"email"`
}

type OrganizationPreCreateSchema struct {
	ID       string `json:"id"`
	District string `json:"district"`
	Region   string `json:"region"`
	Managers string `json:"managers"`
	Email    string `json:"email"`
}

type OrganizationDescriptionUpdateSchema struct {
	Description string `json:"description"`
}
