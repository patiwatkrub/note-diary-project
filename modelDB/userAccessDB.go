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
		return User{}, errors.New("error, insert data to database.")
	}

	//Commit transection
	tx.Commit()
	//Logging and return
	fmt.Printf("%+v\n", aUser)
	return aUser, nil
}

func (user userAccessDB) Verify(userID int) (User, error) {
	//Instant user struct
	aUser := User{}

	//Prepare transection statement
	tx := user.db.Begin()

	//Checking user has exist
	queryStm := "SELECT user_id, username, password, email, confirmation, created_at, updated_at FROM users WHERE user_id = ?"
	result := tx.Raw(queryStm, userID).Scan(&aUser)
	if result.Error != nil {
		tx.Rollback()
		return User{}, errors.New("a user not found!")
	}

	//Logging and Change confirmation value to 1
	fmt.Println("userAccessDB: ", aUser)
	aUser.Confirmation = true

	//Update to database.
	updateConfirmationstm := tx.Save(&aUser)
	if updateConfirmationstm.Error != nil {
		tx.Rollback()
		return User{}, updateConfirmationstm.Error
	}

	//Commit transection statement
	tx.Commit()

	return aUser, nil
}

func (user userAccessDB) ResetPassword(email, newPassword string) (User, error) {
	aUser := User{}

	tx := user.db.Begin()

	queryStm := "SELECT user_id, username, password, email, confirmation, created_at, updated_at FROM users WHERE email = ?"
	result := tx.Raw(queryStm, email).Row()
	if result.Err() != nil {
		tx.Rollback()
		return User{}, errors.New("a user not found.")
	}

	// Do verifying on Email address
	// ...
	// checking
	// (may be use in business layer)

	// and then
	err := result.Scan(&aUser)
	if err != nil {
		tx.Rollback()
		return User{}, err
	}

	ecryptPassword, err := utility.EncyptPassword(newPassword)
	if err != nil {
		tx.Rollback()
		return User{}, err
	}
	aUser.Password = ecryptPassword

	updatePasswordStm := tx.Save(&aUser)
	if updatePasswordStm.Error != nil {
		tx.Rollback()
		return User{}, updatePasswordStm.Error
	}
	tx.Commit()

	return aUser, nil
}

func (user userAccessDB) ChangeEmail(oldEmail, newEmail string) (User, error) {
	aUser := User{}

	tx := user.db.Begin()

	queryStm := "SELECT user_id, username, password, email, confirmation, created_at, updated_at FROM users WHERE email = ?"
	row := tx.Raw(queryStm, oldEmail).Row()
	if row.Err() != nil {
		tx.Rollback()
		return User{}, row.Err()
	}

	err := row.Scan(&aUser)
	if err != nil {
		tx.Rollback()
		return User{}, err
	}

	// Do verifying on email with url and confirmation email to chaging a new email
	// ...

	//and then
	aUser.Email = newEmail
	updateNewEmailStm := tx.Save(&aUser)
	if updateNewEmailStm.Error != nil {
		tx.Rollback()
		return User{}, updateNewEmailStm.Error
	}

	tx.Commit()

	return aUser, nil
}

func (user userAccessDB) Delete(userID int) error {
	tx := user.db.Begin()

	err := tx.Where("user_id = ?", userID).Delete(&User{})
	if err.Error != nil {
		tx.Rollback()
		return err.Error
	}

	tx.Commit()
	return nil
}
