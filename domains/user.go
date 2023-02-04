package domains

import (
	"time"
)

type User struct {
	ID uint `gorm:"column:user_id;autoIncrement"`
	// Image Profile
	Username     string `gorm:"column:username;varchar(12);unique;not null"`
	Password     string `gorm:"coulumn:password;not null"`
	Email        string `gorm:"email;unique;not null"`
	Confirmation bool   `gorm:"confirmation;boolean;default:false;not null"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

type UserInterface interface {
	Create(string, string, string) (User, error)
	GetUserById(int) (User, error)
	GetUsers() ([]User, error)
	Verify(int) (User, error)
	ChangePassword(int, string) (User, error)
	ChangeEmail(string, string) (User, error)
	Delete(int) error
}
