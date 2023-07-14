package domains

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	Number       uint   `gorm:"autoIncrement"`
	Username     string `gorm:"column:username;type:varchar(20);primaryKey;unique;not null"`
	Password     string `gorm:"column:password;not null"`
	Email        string `gorm:"email;unique;not null"`
	Img_Profile  string `gorm:"column:img_profile;"`
	Confirmation int    `gorm:"column:confirmation;type:int;default:0;not null"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
	DeletedAt    gorm.DeletedAt
}

type UserInterface interface {
	Create(string, string, string) error
	GetUser(string) (*User, error)
	GetUsers() ([]User, error)
	GetDeletedUsers() ([]User, error)
	ValidationUser(string, string) (*User, error)
	Verify(string) error
	ResetPassword(string, string, string) (*User, error)
	ChangePassword(string, string) (*User, error)
	ChangeEmail(string, string) (*User, error)
	ChangeEmailAndPassword(string, string, string) (*User, error)
	ChangeImg(string, string) (*User, error)
	Delete(string) error
}
