package models

import "gorm.io/datatypes"

type Organization struct {
	ID          string         `json:"id" gorm:"primary_key"`
	District    string         `json:"district"`
	Region      string         `json:"region"`
	Description string         `json:"description"`
	Manager     datatypes.JSON `json:"managers"`
	Email       string         `json:"email"`
}
