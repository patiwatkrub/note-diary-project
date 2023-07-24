package domains

import (
	"encoding/base64"
	"errors"

	"gorm.io/gorm"
)

// For fix Sonar Lint duplicating
var queryUsersStm string = "SELECT number, username, password, email, img_profile, confirmation, created_at, updated_at, deleted_at FROM users"
var queryUsernameStm string = "SELECT number, username, password, email, img_profile, confirmation, created_at, updated_at, deleted_at FROM users WHERE username = ?"
var queryUsernameAndPasswordStm string = "SELECT number, username, password, email, img_profile, confirmation, created_at, updated_at, deleted_at FROM users WHERE username = ? AND password = ?"
var queryUsernameAndEmailStm string = "SELECT number, username, password, email, img_profile, confirmation, created_at, updated_at, deleted_at FROM users WHERE username = ? AND password = ?"

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

	result := tx.Raw(queryUsernameStm, username).Scan(&aUser)
	if result.RowsAffected > 0 {
		tx.Rollback()
		return ErrUsernameIsExist
	}

	//Insert new User into database
	result = user.db.Create(&aUser)
	if result.Error != nil {
		tx.Rollback()
		return ErrDBCreateUserFailed
	}

	tx.Commit()

	return nil
}

func (user *userAccessDB) GetUser(username string) (aUser *User, err error) {

	result := user.db.Raw(queryUsernameStm, username).Scan(&aUser)
	if result.RowsAffected == 0 {
		return nil, ErrUserNotFound
	}

	if aUser.DeletedAt.Valid {
		return nil, ErrUserDeleted
	}

	return aUser, nil
}

func (user *userAccessDB) GetUsers() (users []User, err error) {

	result := user.db.Raw(queryUsersStm).Scan(&users)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {

		return []User{}, ErrGetUsersFailed
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
	result := user.db.Raw(queryUsernameAndPasswordStm, username, password).Scan(&aUser)
	if result.RowsAffected == 0 {
		return nil, ErrInvalidUsernamePassword
	}
	if aUser.DeletedAt.Valid {
		err = ErrUserDeleted
		return nil, err
	}
	return aUser, nil
}

func (user *userAccessDB) Verify(username string) (err error) {
	var aUser User

	//Prepare transection statement
	tx := user.db.Begin()

	//Checking user has exist
	result := tx.Raw(queryUsernameStm, username).Scan(&aUser)

	if result.RowsAffected == 0 {
		tx.Rollback()
		return ErrEmailNotFound
	}

	if aUser.DeletedAt.Valid {
		tx.Rollback()
		return ErrUserDeleted
	}

	aUser.Confirmation = 1

	//Update to database.
	updateConfirmationstm := tx.Save(&aUser)
	if updateConfirmationstm.Error != nil {
		tx.Rollback()
		return ErrVerifyFailed
	}

	//Commit transection statement
	tx.Commit()

	return nil
}

func (user *userAccessDB) ResetPassword(username, email, newPassword string) (aUser *User, err error) {
	tx := user.db.Begin()

	result := tx.Raw(queryUsernameAndEmailStm, username, email).Scan(&aUser)
	if result.RowsAffected == 0 {
		tx.Rollback()
		return nil, ErrEmailNotFoundToResetPassword
	}

	if aUser.DeletedAt.Valid {
		tx.Rollback()
		return nil, ErrUserDeleted
	}

	aUser.Password = newPassword

	updatedPasswordStm := tx.Save(&aUser)
	if updatedPasswordStm.Error != nil {
		tx.Rollback()
		return nil, ErrResetPasswordFailed
	}

	tx.Commit()

	return aUser, nil
}

func (user *userAccessDB) ChangePassword(username, newPassword string) (aUser *User, err error) {
	tx := user.db.Begin()

	result := tx.Raw(queryUsernameStm, username).Scan(&aUser)
	if result.RowsAffected == 0 {
		tx.Rollback()
		return nil, ErrUserNotFoundToChangePassword
	}

	if aUser.DeletedAt.Valid {
		tx.Rollback()
		return nil, ErrUserDeleted
	}

	aUser.Password = newPassword

	updatePasswordStm := tx.Save(&aUser)
	if updatePasswordStm.Error != nil {
		tx.Rollback()
		return nil, ErrChangePasswordFailed
	}
	tx.Commit()

	return aUser, nil
}

func (user *userAccessDB) ChangeEmail(username, newEmail string) (aUser *User, err error) {
	tx := user.db.Begin()

	result := tx.Raw(queryUsernameStm, username).Scan(&aUser)
	if result.RowsAffected == 0 {
		tx.Rollback()
		return nil, ErrUserNotFoundToChangeEmail
	}

	if aUser.DeletedAt.Valid {
		tx.Rollback()
		return nil, ErrUserDeleted
	}

	aUser.Email = newEmail
	updateNewEmailStm := tx.Save(&aUser)
	if updateNewEmailStm.Error != nil {
		tx.Rollback()
		return nil, ErrChangeEmailFailed
	}

	tx.Commit()

	return aUser, nil
}

func (user *userAccessDB) ChangeEmailAndPassword(username, newEmail, newPassowrd string) (aUser *User, err error) {
	tx := user.db.Begin()

	result := tx.Raw(queryUsernameStm, username).Scan(&aUser)
	if result.RowsAffected == 0 {
		tx.Rollback()
		return nil, ErrUserNotFoundToChangeEmailAndPassword
	}

	if aUser.DeletedAt.Valid {
		tx.Rollback()
		err = ErrUserDeleted
		return nil, err
	}

	aUser.Email = newEmail
	aUser.Password = newPassowrd

	updateUserDataStm := tx.Save(&aUser)
	if updateUserDataStm.Error != nil {
		tx.Rollback()
		return nil, ErrChangeEmailAndPasswordFailed
	}

	tx.Commit()

	return aUser, nil
}

func (user *userAccessDB) ChangeImg(username, imageName string) (aUser *User, err error) {
	tx := user.db.Begin()

	result := tx.Raw(queryUsernameStm, username).Scan(&aUser)
	if result.RowsAffected == 0 {
		tx.Rollback()
		return nil, ErrUserNotFoundToChangeProfile
	}

	if aUser.DeletedAt.Valid {
		tx.Rollback()
		return nil, ErrUserDeleted
	}

	aUser.Img_Profile = imageName

	updateUserImgStm := tx.Save(&aUser)
	if updateUserImgStm.Error != nil {
		tx.Rollback()
		return nil, ErrChangeProfileFailed
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
