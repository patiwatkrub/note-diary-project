package dbAdapter

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

func (user *userAccessDB) Create(username, password, email string) (aUser User, err error) {
	//initial value User
	aUser.Username = username
	aUser.Password = password
	aUser.Email = email

	//Begin transection statement
	tx := user.db.Begin()

	//Insert new User into database
	result := tx.Create(&aUser)
	if result.Error != nil {
		tx.Rollback()
		err = errors.New("error, the username has existed")
		return aUser, err
	}

	//Commit transection
	tx.Commit()

	//Logging and return
	fmt.Printf("%+v\n", aUser)
	return aUser, nil
}

func (user *userAccessDB) GetUserById(userID int) (aUser User, err error) {
	queryStm := "SELECT user_id, username, encrypt_password, email, confirmation, created_at, updated_at FROM users WHERE user_id = ?"

	result := user.db.Raw(queryStm).Scan(&aUser)
	fmt.Printf("%+v\n", aUser)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		err = gorm.ErrRecordNotFound
		return aUser, err
	}

	return aUser, nil
}

func (user *userAccessDB) GetUsers() (users []User, err error) {
	queryStm := "SELECT user_id, username, encrypt_password, email, confirmation, created_at, updated_at FROM users"

	result := user.db.Raw(queryStm).Scan(&users)
	fmt.Printf("%+v\n", users)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		err = gorm.ErrRecordNotFound
		return users, err
	}

	return users, nil
}

func (user *userAccessDB) Verify(userID int) (aUser User, err error) {
	//Prepare transection statement
	tx := user.db.Begin()

	//Checking user has exist
	queryStm := "SELECT user_id, username, encrypt_password, email, confirmation, created_at, updated_at FROM users WHERE user_id = ?"
	result := tx.Raw(queryStm, userID).Scan(&aUser)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		tx.Rollback()
		err = errors.New("a user not found")
		return aUser, err
	}

	aUser.Confirmation = true

	//Update to database.
	updateConfirmationstm := tx.Save(&aUser)
	if updateConfirmationstm.Error != nil {
		tx.Rollback()
		err = updateConfirmationstm.Error
		return aUser, err
	}

	//Commit transection statement
	tx.Commit()

	return aUser, nil
}

func (user *userAccessDB) ChangePassword(userId int, newPassword string) (aUser User, err error) {
	tx := user.db.Begin()

	queryStm := "SELECT user_id, username, encrypt_password, email, confirmation, created_at, updated_at FROM users WHERE user_id = ?"
	row := tx.Raw(queryStm, userId).Row()
	if errors.Is(row.Err(), gorm.ErrRecordNotFound) {
		tx.Rollback()
		err = errors.New("a user not found")
		return aUser, err
	}

	// and then
	err = row.Scan(&aUser)
	if err != nil {
		tx.Rollback()
		return aUser, err
	}

	aUser.Password = newPassword

	updatePasswordStm := tx.Save(&aUser)
	if updatePasswordStm.Error != nil {
		tx.Rollback()
		err = updatePasswordStm.Error
		return aUser, err
	}
	tx.Commit()

	return aUser, nil
}

func (user *userAccessDB) ChangeEmail(oldEmail, newEmail string) (aUser User, err error) {
	tx := user.db.Begin()

	queryStm := "SELECT user_id, username, encrypt_password, email, confirmation, created_at, updated_at FROM users WHERE email = ?"
	row := tx.Raw(queryStm, oldEmail).Row()
	if errors.Is(row.Err(), gorm.ErrRecordNotFound) {
		tx.Rollback()
		err = errors.New("error, the email not found")
		return aUser, err
	}

	err = row.Scan(&aUser)
	if err != nil {
		tx.Rollback()
		return aUser, err
	}

	aUser.Email = newEmail
	updateNewEmailStm := tx.Save(&aUser)
	if updateNewEmailStm.Error != nil {
		tx.Rollback()
		err = updateNewEmailStm.Error
		return aUser, err
	}

	tx.Commit()

	return aUser, nil
}

func (user *userAccessDB) Delete(userID int) error {
	tx := user.db.Begin()

	err := tx.Where("user_id = ?", userID).Delete(&User{})
	if err.Error != nil {
		tx.Rollback()
		return err.Error
	}

	tx.Commit()
	return nil
}
