package services

import (
	"errors"
	"fmt"
	"log"
	"os"
	"regexp"

	"github.com/patiwatkrub/note-diary-project/back-end/domains"
	"github.com/patiwatkrub/note-diary-project/back-end/utility"
)

type userAccessService struct {
	userDBI domains.UserInterface
	mailer  domains.EmailValidateInterface
}

func NewUserAccessingService(userDBI domains.UserInterface, mailer domains.EmailValidateInterface) userAccessService {
	return userAccessService{userDBI: userDBI, mailer: mailer}
}

func (user userAccessService) CreateUserAccount(username, password, email string) (err error) {
	// เช็คความถูกต้องของชื่อผู้ใช้งาน
	matched, err := regexp.MatchString(`[(^\w)]`, username)
	if err != nil {
		log.Printf("gotten an error: %v", err)
		return err
	}

	if !matched {
		err = errors.New("username must be alphabet character, number or underscore(_) mixed")
		log.Printf("gotten an error %v", err)
		return err
	}

	// เช็คความยาวของชื่อผู้ใช้งาน
	if len(username) < 6 && len(username) >= 12 {
		err = errors.New("username must be length more than 6 and less than 12")
		log.Printf("gotten an error: %v", err)
		return err
	}

	// เข้ารหัสของรหัสผ่านผู้ใช้
	encyptPassword, err := utility.EncyptPassword(password)
	if err != nil {
		log.Printf("gotten an error %v", err)
		return err
	}

	// เช็คความถูกต้องของอีเมล์
	matched, err = regexp.MatchString(`(\w+)(@)(mail|gmail|hotmail|thaimail|outlook|aol|yahoo)(\.)(com|net)`, email)
	if err != nil {
		log.Printf("gotten an error: %v", err)
		return err
	}

	if !matched {
		err = errors.New("we are serve mail domains on mail, hotmail, gmail, yahoo etc")
		log.Printf("gotten an error: %v", err)
		return err
	}

	// สร้างแอดเคาน์ผู้ใช้งาน
	getUser, err := user.userDBI.Create(username, encyptPassword, email)
	if err != nil {
		log.Printf("gotten an error %v", err)
		return err
	}

	fmt.Printf("Created: %+v", getUser)

	// ส่งอีเมล์สำหรับยื่นยัน
	fromAccount := "patiwatkongram@gmail.com"
	topic := "Note-diary verification email"

	// Read file for chosen a page to sending verify mail

	// Why can't used ../template/mail-verification.html path
	readFile, err := os.ReadFile("template/mail-verification.html")
	if err != nil {
		log.Printf("gotten an error: %v", err)
		return err
	}

	user.mailer.SetAddress(email)
	user.mailer.SetContext(fromAccount, topic, string(readFile))
	if err = user.mailer.SendMail(); err != nil {
		log.Printf("gotten an error: %v", err)
		return err
	}

	return nil
}

func (user userAccessService) GetUser(userID int) (aUser UserResponse, err error) {
	getUser, err := user.userDBI.GetUserById(userID)
	if err != nil {
		log.Printf("gotten an error: %v", err)
		return aUser, err
	}

	aUser.UserID = getUser.ID
	aUser.Username = getUser.Username
	aUser.Password = getUser.Password
	aUser.Email = getUser.Email

	return aUser, nil
}

func (user userAccessService) GetUsers() (users []UserResponse, err error) {

	getUser, err := user.userDBI.GetUsers()
	if err != nil {
		log.Printf("gotten an error: %v", err)
		return users, err
	}
	for _, aUser := range getUser {
		users = append(users, UserResponse{
			UserID:   aUser.ID,
			Username: aUser.Username,
			Password: aUser.Password,
			Email:    aUser.Email,
		})
	}

	return users, nil
}

func (user userAccessService) Verify(userID int) (aUser UserResponse, err error) {
	getUser, err := user.userDBI.Verify(userID)
	if err != nil {
		log.Printf("gooten an error: %v", err)
		return aUser, err
	}
	aUser.UserID = getUser.ID
	aUser.Username = getUser.Username
	aUser.Password = getUser.Password
	aUser.Email = getUser.Email

	return aUser, nil
}

func (user userAccessService) ChangePassword(userID int, newPassword string) (aUser UserResponse, err error) {
	encryptePassword, err := utility.EncyptPassword(newPassword)
	if err != nil {
		log.Printf("gotten an error: %v", err)
		return aUser, err
	}
	getUser, err := user.userDBI.ChangePassword(userID, encryptePassword)
	if err != nil {
		log.Printf("gotten an error: %v", err)
		return aUser, err
	}

	aUser.UserID = getUser.ID
	aUser.Username = getUser.Username
	aUser.Password = getUser.Password
	aUser.Email = getUser.Email

	return aUser, nil
}

func (user userAccessService) ChangeEmail(username string, newEmail string) (aUser UserResponse, err error) {
	matched, err := regexp.MatchString(`(\w+)(@)(mail|gmail|hotmail|thaimail|outlook|aol|yahoo)(\.)(com|net)`, newEmail)
	if err != nil {
		log.Printf("gotten an error: %v", err)
		return aUser, err
	}

	if !matched {
		err = errors.New("we are serve mail domains on mail, hotmail, gmail, yahoo etc")
		log.Printf("gotten an error: %v", err)
		return aUser, err
	}

	getUser, err := user.userDBI.ChangeEmail(username, newEmail)
	if err != nil {
		log.Printf("gotten an error: %v", err)
		return aUser, err
	}

	aUser.UserID = getUser.ID
	aUser.Username = getUser.Username
	aUser.Password = getUser.Password
	aUser.Email = getUser.Email

	return aUser, nil
}

func (user userAccessService) DeleteUser(userID int) (err error) {
	return user.userDBI.Delete(userID)
}
