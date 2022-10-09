package modelDB

import (
	"errors"
	"fmt"

	"gorm.io/gorm"
)

type userAccessDB struct {
	db *gorm.DB
}

func NewUserAccessingDB(db *gorm.DB) userAccessDB {
	return userAccessDB{db: db}
}

func (user userAccessDB) Create(username, ecyptPassword, email string) (User, error) {
	aUser := User{
		Username:       username,
		EncyptPassword: ecyptPassword,
		Email:          email,
	}

	tx := user.db.Begin()
	result := tx.Find(&aUser, "username = ?", username)
	if result.RowsAffected > 0 {
		tx.Rollback()
		return User{}, errors.New("username has existed.")
	}

	result = tx.Create(&aUser)
	if result.Error != nil {
		tx.Rollback()
		return User{}, result.Error
	}

	tx.Commit()
	fmt.Printf("%+v\n", aUser)
	return aUser, nil
}

func (user userAccessDB) Activate() (*User, error) {
	return &User{}, nil
}

func (user userAccessDB) UpdatePassword(password string) (*User, error) {
	return &User{}, nil
}
