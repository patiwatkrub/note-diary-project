package services

import (
	"encoding/base64"
	"fmt"
	"os"
	"regexp"
	"strings"

	"github.com/patiwatkrub/note-diary-project/back-end/domains"
	"github.com/patiwatkrub/note-diary-project/back-end/errs"
	"github.com/patiwatkrub/note-diary-project/back-end/logs"
	"github.com/patiwatkrub/note-diary-project/back-end/utility"
)

type userAccessService struct {
	userDBI domains.UserInterface
	mailer  EmailValidateInterface
}

func NewUserAccessingService(userDBI domains.UserInterface, mailer EmailValidateInterface) UserService {
	return &userAccessService{userDBI: userDBI, mailer: mailer}
}

func (user *userAccessService) CreateUserAccount(username, password, email string) (err error) {
	// Check Username
	matched, err := regexp.MatchString(`[(^\w)]`, username)
	if err != nil {
		logs.Error(err)
		errS := errs.NewInternalServerError()
		return errS
	}

	if !matched {
		errS := errs.NewInvalidUsernamePattern()
		logs.Error(errS.ErrorMessage)
		return errS
	}

	// Check Username length is correct
	if len(username) < 6 || len(username) > 20 {
		errS := errs.NewInvalidUsernameLength()
		logs.Error(errS.ErrorMessage)
		return err
	}

	// Encryption password
	encyptPassword, err := utility.EncyptPassword(password)
	if err != nil {
		logs.Error(err)
		errS := errs.NewInternalServerError()
		return errS
	}

	// Check format of Email
	matched, err = regexp.MatchString(`(\w+)(@)(mail|gmail|hotmail|thaimail|outlook|aol|yahoo)(\.)(com|net)`, email)
	if err != nil {
		logs.Error(err)
		errS := errs.NewInternalServerError()
		return errS
	}

	if !matched {
		errS := errs.NewInvlidEmailPattern()
		logs.Error(errS.ErrorMessage)
		return errS
	}

	// Sending Email to verify
	fromAccount := "patiwatkongram@gmail.com"
	topic := "Note-diary verification email"

	// Read file for chosen a page to sending verify mail
	readFile, err := os.ReadFile("public/mail-verification.html")
	if err != nil {
		logs.Error(err)
		errS := errs.NewInternalServerError()
		return errS
	}

	manualMappingPageStr := strings.ReplaceAll(string(readFile), "{{.Name}}", username)

	user.mailer.SetAddress(email)
	user.mailer.SetContext(fromAccount, topic, manualMappingPageStr)
	if err = user.mailer.SendMail(); err != nil {
		logs.Error(err)
		errS := errs.NewInternalServerError()
		return errS
	}

	// Create user account
	err = user.userDBI.Create(username, encyptPassword, email)
	if err != nil {
		logs.Error(err)
		errS := errs.NewBadRequest()
		return errS
	}

	return nil
}

func (user *userAccessService) GetUser(username string) (*UserResponse, error) {
	getUser, err := user.userDBI.GetUser(username)
	if err != nil {
		logs.Error(err)
		errS := errs.NewUserNotFound()
		return nil, errS
	}

	decodedResult, err := base64.StdEncoding.DecodeString(getUser.Img_Profile)
	if err != nil {
		logs.Error(err)
		errS := errs.NewInternalServerError()
		return nil, errS
	}

	aUser := NewUserResponse(getUser.Username, "password", getUser.Email, string(decodedResult))

	return aUser, nil
}

func (user *userAccessService) GetUsers() (users []UserResponse, err error) {

	getUsers, err := user.userDBI.GetUsers()
	if err != nil {
		errS := errs.NewUnexpected(err)
		logs.Error(errS.ErrorMessage)
		return []UserResponse{}, errS
	}
	for _, aUser := range getUsers {

		if aUser.DeletedAt.Valid {
			continue
		}

		decodedResult, err := base64.StdEncoding.DecodeString(aUser.Img_Profile)

		if err != nil {
			logs.Error(err)
			errS := errs.NewInternalServerError()
			return []UserResponse{}, errS
		}

		users = append(users, UserResponse{
			Username:    aUser.Username,
			Password:    "password",
			Email:       aUser.Email,
			Img_Profile: string(decodedResult),
		})
	}

	return users, nil
}

func (user *userAccessService) GetDeletedUsers() (users []UserResponse, err error) {

	getDeletedUsers, err := user.userDBI.GetDeletedUsers()
	if err != nil {
		errS := errs.NewUnexpected(err)
		logs.Error(errS.ErrorMessage)
		return []UserResponse{}, errS
	}

	for _, aDeletedUser := range getDeletedUsers {

		if !aDeletedUser.DeletedAt.Valid {
			continue
		}

		decodedResult, err := base64.StdEncoding.DecodeString(aDeletedUser.Img_Profile)

		if err != nil {
			logs.Error(err)
			errS := errs.NewInternalServerError()
			return []UserResponse{}, errS
		}

		users = append(users, UserResponse{
			Username:    aDeletedUser.Username,
			Password:    "password",
			Email:       aDeletedUser.Email,
			Img_Profile: string(decodedResult),
		})
	}

	return users, nil
}

// Login is return three parameter(UserResponse Data, Verified email code status and error)
// Verified email code status have -1, 0, 0
// -1 Normal error
// 0 Not confirm email to verify
// 1 is confirm email to verify
func (user *userAccessService) Login(username, password string) (*UserResponse, int, error) {
	getUser, err := user.userDBI.GetUser(username)
	if err != nil {
		logs.Error(err)
		errS := errs.NewUserNotFound()

		return nil, -1, errS
	}

	success, err := utility.ComparePassword(getUser.Password, password)
	if err != nil {
		logs.Error(err)
		errS := errs.NewInternalServerError()
		return nil, -1, errS
	}

	if !success {
		errS := errs.NewInvalidPassword()
		logs.Error(errS.ErrorMessage)
		return nil, -1, errS
	}

	getUser, err = user.userDBI.ValidationUser(username, getUser.Password)
	if err != nil {
		logs.Error(err)
		errS := errs.NewLoginFail()
		return nil, -1, errS
	}

	decodedResult, err := base64.StdEncoding.DecodeString(getUser.Img_Profile)
	if err != nil {
		logs.Error(err)
		errS := errs.NewInternalServerError()
		return nil, -1, errS
	}

	aUser := NewUserResponse(getUser.Username, "password", getUser.Email, string(decodedResult))

	if getUser.Confirmation != 1 {
		errS := errs.NewEmailNotVerify()
		logs.Info(fmt.Sprintf(`%v, %v`, username, errS.ErrorMessage))
		return aUser, 0, errS
	}

	return aUser, 1, nil
}

func (user *userAccessService) Verify(username string) error {
	err := user.userDBI.Verify(username)
	if err != nil {
		logs.Error(err)
		errS := errs.NewInternalServerError()
		return errS
	}

	return nil
}

func (user *userAccessService) ResetPassword(username, email, newPassword string) (*UserResponse, error) {
	encyptPassword, err := utility.EncyptPassword(newPassword)
	if err != nil {
		logs.Error(err)
		errS := errs.NewInternalServerError()
		return nil, errS
	}

	getUser, err := user.userDBI.ResetPassword(username, email, encyptPassword)
	if err != nil {
		logs.Error(err)
		errS := errs.NewInternalServerError()
		return nil, errS
	}

	decodedResult, err := base64.StdEncoding.DecodeString(getUser.Img_Profile)
	if err != nil {
		logs.Error(err)
		errS := errs.NewInternalServerError()
		return nil, errS
	}

	aUser := NewUserResponse(getUser.Username, "password", getUser.Email, string(decodedResult))

	return aUser, nil
}

func (user *userAccessService) ChangePassword(username string, password, newPassword string) (*UserResponse, error) {
	getUser, err := user.userDBI.GetUser(username)
	if err != nil {
		logs.Error(err)
		errS := errs.NewUserNotFound()

		return nil, errS
	}

	ok, err := utility.ComparePassword(getUser.Password, password)
	if err != nil {
		logs.Error(err)
		errS := errs.NewInternalServerError()
		return nil, errS
	}

	if !ok {
		errS := errs.NewInvalidPassword()
		logs.Error(errS.ErrorMessage)
		return nil, errS
	}

	encryptNewPassword, err := utility.EncyptPassword(newPassword)
	if err != nil {
		logs.Error(err)
		errS := errs.NewInternalServerError()
		return nil, errS
	}

	getUser, err = user.userDBI.ChangePassword(username, encryptNewPassword)
	if err != nil {
		logs.Error(err)
		errS := errs.NewInternalServerError()
		return nil, errS
	}

	decodedResult, err := base64.StdEncoding.DecodeString(getUser.Img_Profile)
	if err != nil {
		logs.Error(err)
		errS := errs.NewInternalServerError()
		return nil, errS
	}

	aUser := NewUserResponse(getUser.Username, "password", getUser.Email, string(decodedResult))

	return aUser, nil
}

func (user *userAccessService) ChangeEmail(username, password, newEmail string) (*UserResponse, error) {
	matched, err := regexp.MatchString(`(\w+)(@)(mail|gmail|hotmail|thaimail|outlook|aol|yahoo)(\.)(com|net)`, newEmail)
	if err != nil {
		logs.Error(err)
		errS := errs.NewInternalServerError()
		return nil, errS
	}

	if !matched {
		errS := errs.NewInvlidEmailPattern()
		logs.Error(errS.ErrorMessage)
		return nil, errS
	}

	getUser, err := user.userDBI.GetUser(username)

	if err != nil {
		logs.Error(err)
		errS := errs.NewUserNotFound()

		return nil, errS
	}

	ok, err := utility.ComparePassword(getUser.Password, password)
	if err != nil {
		logs.Error(err)
		errS := errs.NewInternalServerError()
		return nil, errS
	}

	if !ok {
		errS := errs.NewInvalidPassword()
		logs.Error(errS.ErrorMessage)
		return nil, errS
	}

	getUser, err = user.userDBI.ChangeEmail(username, newEmail)
	if err != nil {
		logs.Error(err)
		errS := errs.NewInternalServerError()
		return nil, errS
	}

	decodedResult, err := base64.StdEncoding.DecodeString(getUser.Img_Profile)
	if err != nil {
		logs.Error(err)
		errS := errs.NewInternalServerError()
		return nil, errS
	}

	aUser := NewUserResponse(getUser.Username, "password", getUser.Email, string(decodedResult))

	return aUser, nil
}

func (user *userAccessService) ChangeEmailAndPassword(username, password, newEmail, newPassword string) (*UserResponse, error) {

	// Validate Email
	matched, err := regexp.MatchString(`(\w+)(@)(mail|gmail|hotmail|thaimail|outlook|aol|yahoo)(\.)(com|net)`, newEmail)
	if err != nil {
		logs.Error(err)
		errS := errs.NewInternalServerError()
		return nil, errS
	}

	if !matched {
		errS := errs.NewInvlidEmailPattern()
		logs.Error(errS.ErrorMessage)
		return nil, errS
	}

	// Validate Password
	getUser, err := user.userDBI.GetUser(username)
	if err != nil {
		logs.Error(err)
		errS := errs.NewUserNotFound()

		return nil, errS
	}

	ok, err := utility.ComparePassword(getUser.Password, password)
	if err != nil {
		logs.Error(err)
		errS := errs.NewInternalServerError()
		return nil, errS
	}

	if !ok {
		errS := errs.NewInvalidPassword()
		logs.Error(errS.ErrorMessage)
		return nil, errS
	}
	encryptNewPassword, err := utility.EncyptPassword(newPassword)
	if err != nil {
		logs.Error(err)
		errS := errs.NewInternalServerError()
		return nil, errS
	}

	getUser, err = user.userDBI.ChangeEmailAndPassword(username, newEmail, encryptNewPassword)
	if err != nil {
		logs.Error(err)
		errS := errs.NewInternalServerError()
		return nil, errS
	}

	decodedResult, err := base64.StdEncoding.DecodeString(getUser.Img_Profile)
	if err != nil {
		logs.Error(err)
		errS := errs.NewInternalServerError()
		return nil, errS
	}

	aUser := NewUserResponse(getUser.Username, "password", getUser.Email, string(decodedResult))

	return aUser, nil
}

func (user *userAccessService) UploadImgProfile(username, imageName string) (*UserResponse, error) {

	ImageNameEncoder := base64.StdEncoding.EncodeToString([]byte(imageName))
	getUser, err := user.userDBI.ChangeImg(username, ImageNameEncoder)
	if err != nil {
		logs.Error(err)
		errS := errs.NewInternalServerError()
		return nil, errS
	}

	decodedResult, err := base64.StdEncoding.DecodeString(getUser.Img_Profile)
	if err != nil {
		logs.Error(err)
		errS := errs.NewInternalServerError()
		return nil, errS
	}

	aUser := NewUserResponse(getUser.Username, "password", getUser.Email, string(decodedResult))

	return aUser, nil
}

func (user *userAccessService) DeleteUser(username string) (err error) {

	var errS errs.CustomError

	err = user.userDBI.Delete(username)

	if err != nil {
		logs.Error(err)
		errS = errs.NewInternalServerError()
	}

	return errS
}
