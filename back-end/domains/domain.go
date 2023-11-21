package domains

import "errors"

var (
	// Global User Error Variables
	ErrUsernameAndEmailIsExist              = errors.New("the username and email is existed")
	ErrDBCreateUserFailed                   = errors.New("can not record user data")
	ErrUserNotFound                         = errors.New("user is not found")
	ErrUserDeleted                          = errors.New("user is deleted")
	ErrGetUsersFailed                       = errors.New("can not get user data")
	ErrInvalidUsernamePassword              = errors.New("username and password is not valid")
	ErrEmailNotFound                        = errors.New("the email not found")
	ErrVerifyFailed                         = errors.New("can not verify user data")
	ErrEmailNotFoundToResetPassword         = errors.New("the email note found for reset password")
	ErrResetPasswordFailed                  = errors.New("can not update user data for reset password")
	ErrUserNotFoundToChangePassword         = errors.New("the user not found for change password")
	ErrChangePasswordFailed                 = errors.New("can not update user data for change password")
	ErrUserNotFoundToChangeEmail            = errors.New("the user not found for change email")
	ErrChangeEmailFailed                    = errors.New("can not update user data for change email")
	ErrUserNotFoundToChangeEmailAndPassword = errors.New("the user not found for change email and password")
	ErrChangeEmailAndPasswordFailed         = errors.New("can not update user data for change email and password")
	ErrUserNotFoundToChangeProfile          = errors.New("the user not found for change profile")
	ErrChangeProfileFailed                  = errors.New("can not update user data for change profile image")

	// Global Note Error Variables
	ErrInvalidAuthorToCreateNote = errors.New("can not create a note with author")
	ErrCreateNoteFailed          = errors.New("can not record note data")
	ErrInvalidNoteIDAndAuthor    = errors.New("can not get a note with noteID and author")
	ErrGetNotesFailed            = errors.New("can not get notes with author")
	ErrInvalidAuthorToUpdateNote = errors.New("can not update a note with author")
	ErrInvalidDiaryType          = errors.New("can not update a note with invalid diary type")
	ErrUpdateNoteFailed          = errors.New("can not update note data for change detail")
	ErrInvlidAuthorToDeleteNote  = errors.New("user not found")
)
