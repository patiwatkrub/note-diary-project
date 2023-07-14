package domains

import (
	"encoding/base64"
	"errors"

	"gorm.io/gorm"
)

// For fix Sonar Lint duplicating
var queryStm string = "SELECT number, username, password, email, img_profile, confirmation, created_at, updated_at, deleted_at FROM users WHERE username = ?"
var userDeletedError string = "user is deleted"

type userAccessDB struct {
	db *gorm.DB
}

func NewUserAccessingDB(db *gorm.DB) UserInterface {
	return &userAccessDB{db: db}
}

func (user *userAccessDB) Create(username, password, email string) (err error) {
	//Begin transection statement
	tx := user.db.Begin()

	aUser := &User{}

	//initial value User
	aUser.Username = username
	aUser.Password = password
	aUser.Email = email

	defaultImg := "/public/profile-photo-default.png"
	defaultImgEncoder := base64.StdEncoding.EncodeToString([]byte(defaultImg))
	aUser.Img_Profile = defaultImgEncoder

	result := tx.Raw(queryStm, username).Scan(&aUser)
	if result.RowsAffected > 0 {
		tx.Rollback()
		err = errors.New("the username is existed")
		return err
	}

	//Insert new User into database
	result = user.db.Create(&aUser)
	if result.Error != nil {
		tx.Rollback()
		err = errors.New("can not record user data")
		return err
	}

	return nil
}

func (user *userAccessDB) GetUser(username string) (aUser *User, err error) {

	result := user.db.Raw(queryStm, username).Scan(&aUser)
	if result.RowsAffected == 0 {
		err = errors.New("user is not found")
		return nil, err
	}

	if aUser.DeletedAt.Valid {
		err = errors.New(userDeletedError)
		return nil, err
	}

	return aUser, nil
}

func (user *userAccessDB) GetUsers() (users []User, err error) {

	result := user.db.Raw(queryStm).Scan(&users)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		err = errors.New("can not get user data")
		return []User{}, err
	}

	return users, nil
}

func (user *userAccessDB) GetDeletedUsers() (users []User, err error) {
	// Purpose command: SQL Query search for user is deleted by soft delete
	result := user.db.Unscoped().Find(&users)
	if result.Error != nil {
		return []User{}, err
	}
	return users, nil
}

func (user *userAccessDB) ValidationUser(username, password string) (aUser *User, err error) {
	result := user.db.Raw(queryStm, username, password).Scan(&aUser)
	if result.RowsAffected == 0 {
		err = errors.New("username and password is not valid")
		return nil, err
	}
	if aUser.DeletedAt.Valid {
		err = errors.New(userDeletedError)
		return nil, err
	}
	return aUser, nil
}

func (user *userAccessDB) Verify(username string) (err error) {
	var aUser User

	//Prepare transection statement
	tx := user.db.Begin()

	//Checking user has exist
	result := tx.Raw(queryStm, username).Scan(&aUser)

	if result.RowsAffected == 0 {
		tx.Rollback()
		err = errors.New("the user not found for verify email")
		return err
	}

	if aUser.DeletedAt.Valid {
		tx.Rollback()
		err = errors.New(userDeletedError)
		return err
	}

	aUser.Confirmation = 1

	//Update to database.
	updateConfirmationstm := tx.Save(&aUser)
	if updateConfirmationstm.Error != nil {
		tx.Rollback()
		err = errors.New("can not verify user data")
		return err
	}

	//Commit transection statement
	tx.Commit()

	return nil
}

func (user *userAccessDB) ResetPassword(username, email, newPassword string) (aUser *User, err error) {
	tx := user.db.Begin()

	result := tx.Raw(queryStm, username, email).Scan(&aUser)
	if result.RowsAffected == 0 {
		tx.Rollback()
		err = errors.New("the email note found for reset password")
		return nil, err
	}

	if aUser.DeletedAt.Valid {
		tx.Rollback()
		err = errors.New(userDeletedError)
		return nil, err
	}

	aUser.Password = newPassword

	updatedPasswordStm := tx.Save(&aUser)
	if updatedPasswordStm.Error != nil {
		tx.Rollback()
		err = errors.New("can not update user data for reset password")
		return nil, err
	}

	tx.Commit()

	return aUser, nil
}

func (user *userAccessDB) ChangePassword(username, newPassword string) (aUser *User, err error) {
	tx := user.db.Begin()

	result := tx.Raw(queryStm, username).Scan(&aUser)
	if result.RowsAffected == 0 {
		tx.Rollback()
		err = errors.New("the user not found for change password")
		return nil, err
	}

	if aUser.DeletedAt.Valid {
		tx.Rollback()
		err = errors.New(userDeletedError)
		return nil, err
	}

	aUser.Password = newPassword

	updatePasswordStm := tx.Save(&aUser)
	if updatePasswordStm.Error != nil {
		tx.Rollback()
		err = errors.New("can not update user data for change password")
		return nil, err
	}
	tx.Commit()

	return aUser, nil
}

func (user *userAccessDB) ChangeEmail(username, newEmail string) (aUser *User, err error) {
	tx := user.db.Begin()

	result := tx.Raw(queryStm, username).Scan(&aUser)
	if result.RowsAffected == 0 {
		tx.Rollback()
		err = errors.New("the user not found for change email")
		return nil, err
	}

	if aUser.DeletedAt.Valid {
		tx.Rollback()
		err = errors.New(userDeletedError)
		return nil, err
	}

	aUser.Email = newEmail
	updateNewEmailStm := tx.Save(&aUser)
	if updateNewEmailStm.Error != nil {
		tx.Rollback()
		err = errors.New("can not update user data for change email")
		return nil, err
	}

	tx.Commit()

	return aUser, nil
}

func (user *userAccessDB) ChangeEmailAndPassword(username, newEmail, newPassowrd string) (aUser *User, err error) {
	tx := user.db.Begin()

	result := tx.Raw(queryStm, username).Scan(&aUser)
	if result.RowsAffected == 0 {
		tx.Rollback()
		err = errors.New("the user not found for change email and password")
		return nil, err
	}

	if aUser.DeletedAt.Valid {
		tx.Rollback()
		err = errors.New(userDeletedError)
		return nil, err
	}

	aUser.Email = newEmail
	aUser.Password = newPassowrd

	updateUserDataStm := tx.Save(&aUser)
	if updateUserDataStm.Error != nil {
		tx.Rollback()
		err = errors.New("can not update user data for change email and password")
		return nil, err
	}

	tx.Commit()

	return aUser, nil
}

func (user *userAccessDB) ChangeImg(username, imageName string) (aUser *User, err error) {
	tx := user.db.Begin()

	result := tx.Raw(queryStm, username).Scan(&aUser)
	if result.RowsAffected == 0 {
		tx.Rollback()
		err = errors.New("the user not found for change profile")
		return nil, err
	}

	if aUser.DeletedAt.Valid {
		tx.Rollback()
		err = errors.New(userDeletedError)
		return nil, err
	}

	aUser.Img_Profile = imageName

	updateUserImgStm := tx.Save(&aUser)
	if updateUserImgStm.Error != nil {
		tx.Rollback()
		err = errors.New("can not update user data for change profile image")
		return nil, err
	}

	tx.Commit()

	return aUser, nil
}

func (user *userAccessDB) Delete(username string) error {
	tx := user.db.Begin()

	err := tx.Where("username = ?", username).Delete(&User{})
	if err.Error != nil {
		tx.Rollback()
		return err.Error
	}

	tx.Commit()
	return nil
}
