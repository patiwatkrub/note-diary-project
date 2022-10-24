package modelDB

import (
	"time"
)

type User struct {
	ID uint `gorm:"column:user_id;autoIncrement"`
	// Image Profile
	Username     string `gorm:"column:username;varchar(12);unique;not null"`
	Password     string `gorm:"coulumn:ecypt_password;not null"`
	Email        string `gorm:"email;not null"`
	Confirmation bool   `gorm:"confirmation;boolean;default:false;not null"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

type UserInterface interface {
	Create(string, string, string) (User, error)
	Activate(int) (*User, error)
	UpdatePassword(string) (*User, error)
}
