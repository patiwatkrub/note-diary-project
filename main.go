package main

import (
	"fmt"

	"github.com/patiwatkrub/note-diary-project/domains"
	"github.com/patiwatkrub/note-diary-project/services"
)

func main() {
	db := initDatabase()
	mailer := InitGoMail()

	userAccessDB := domains.NewUserAccessingDB(db)
	mailAdapter := domains.NewMailValidateAccess(mailer)
	userAccessService := services.NewUserAccessingService(&userAccessDB, &mailAdapter)

	// userA, err := userAccessDB.Create("UserA", "123456789", "patiwatkrubst@hotmail.com")
	// if err != nil {
	// 	panic(err)
	// }

	/* userB, err := userAccessDB.Create("UserB", "987654321", "patiwatkrubnd@hotmail.com")
	if err != nil {
		panic(err)
	}
	userC, err := userAccessDB.Create("UserC", "123456", "patiwatkrubst_pgo@outlook.com")
	if err != nil {
		panic(err)
	} */

	// DB domains
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

	// Services
	err := userAccessService.CreateUser("UserA", "123456789", "patiwatkrubst@hotmail.com")
	if err != nil {
		panic(err)
	}

	/*err = userAccessService.CreateUser("UserB", "987654321", "patiwatkongram@gmail.com")
	if err != nil {
		panic(err)
	}

	err = userAccessService.CreateUser("UserC", "123456", "patiwatkrubst_pgo@outlook.com")
	if err != nil {
		panic(err)
	} */

	users, err := userAccessService.GetUsers()
	if err != nil {
		panic(err)
	}

	fmt.Printf("Users: %+v\n", users)

	user, err := userAccessService.GetUser(1)
	if err != nil {
		panic(err)
	}

	fmt.Printf("User: %+v\n", user)

}
