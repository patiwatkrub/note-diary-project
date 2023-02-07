package main

import (
	"os"

	"github.com/patiwatkrub/note-diary-project/domains"
)

func main() {
	db := initDatabase()
	mailer := InitGoMail()

	userAccessDB := domains.NewUserAccessingDB(db)
	mailAdapter := domains.NewMailValidateAccess(mailer)
	_ = userAccessDB
	_ = mailAdapter

	userA, err := userAccessDB.Create("UserA", "123456789", "patiwatkrubst@hotmail.com")
	if err != nil {
		panic(err)
	}
	/* userB, err := userAccessDB.Create("UserB", "987654321", "patiwatkrubnd@hotmail.com")
	if err != nil {
		panic(err)
	}
	userC, err := userAccessDB.Create("UserC", "123456", "patiwatkrubst_pgo@outlook.com")
	if err != nil {
		panic(err)
	} */

	terminal := []string{
		userA.Email,
		/* userB.Email,
		userC.Email, */
	}

	o, e := os.ReadFile("template/mail-verification-output.html")
	if e != nil {
		panic(e)
	}

	mailAdapter.SetAddress(terminal)
	mailAdapter.SetContext("patiwatkongram@gmail.com", "Note-diary verification email", string(o))

	// Read file for chosen a page to sending verify mail
	if err = mailAdapter.SendMail(); err != nil {
		panic(err)
	}

	/* users, err := userAccessDB.GetUsers()
	if err != nil {
		fmt.Errorf("error: %v\n", err)
	}
	fmt.Printf("%+v", users)

	aUser, err := userAccessDB.GetUserById(3)
	if err != nil {
		fmt.Errorf("error: %v\n", err)
	}
	fmt.Printf("%+v\n", aUser)

	aUser, err = userAccessDB.Verify(3)
	if err != nil {
		fmt.Errorf("error: %v\n", err)
	}
	fmt.Printf("%+v\n", aUser)

	aUser, err = userAccessDB.ChangePassword(3, "secret-password")
	if err != nil {
		fmt.Errorf("error: %v\n", err)
	}
	fmt.Printf("%+v\n", aUser)

	aUser, err = userAccessDB.ChangeEmail("patiwatkrubst_pgo@outlook.com", "patiwat_email@hotmail.com")
	if err != nil {
		fmt.Errorf("error: %v\n", err)
	}
	fmt.Printf("%+v\n", aUser)

	userAccessDB.Delete(1)
	userAccessDB.Delete(2)

	users, err = userAccessDB.GetUsers()
	if err != nil {
		fmt.Errorf("error: %v\n", err)
	}
	fmt.Printf("%+v", users)

	userAccessDB.Delete(3)

	users, err = userAccessDB.GetUsers()
	if err != nil {
		fmt.Errorf("error: %v\n", err)
	}
	fmt.Printf("%+v", users) */
}
