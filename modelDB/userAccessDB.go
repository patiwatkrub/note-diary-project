package modelDB

import (
	"errors"
	"fmt"

	"github.com/patiwatkrub/note-diary-project/utility"
	"gorm.io/gorm"
)

type userAccessDB struct {
	db *gorm.DB
}

func NewUserAccessingDB(db *gorm.DB) userAccessDB {
	return userAccessDB{db: db}
}

func (user userAccessDB) Create(username, password, email string) (User, error) {
	//Generate Encrypt Password
	encryptPWD, err := utility.EncyptPassword(password)
	if err != nil {
		return User{}, err
	}

	//Instance User struct
	aUser := User{
		Username: username,
		Password: encryptPWD,
		Email:    email,
	}

	//Begin transection statement
	tx := user.db.Begin()
	//Check User has exist
	result := tx.Find(&aUser, "username = ?", username)
	if result.RowsAffected > 0 {
		tx.Rollback()
		return User{}, errors.New("username has existed.")
	}

	//Insert new User into database
	result = tx.Create(&aUser)
	if result.Error != nil {
		tx.Rollback()
		return User{}, result.Error
	}

	//Commit transection
	tx.Commit()
	//Logging and return
	fmt.Printf("%+v\n", aUser)
	return aUser, nil
}

func (user *userAccessDB) Activate(userID int) (*User, error) {

	return &User{}, nil
}

func (user userAccessDB) UpdatePassword(password string) (*User, error) {
	return &User{}, nil
}
