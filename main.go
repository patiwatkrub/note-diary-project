package main

import (
	"github.com/patiwatkrub/note-diary-project/dbAdapter"
	"github.com/patiwatkrub/note-diary-project/mailAdapter"
)

func main() {
	db := initDatabase()
	mailer := InitGoMail()

	userAccessDB := dbAdapter.NewUserAccessingDB(db)
	mailAdapter := mailAdapter.NewMailValidateAccess(mailer)
	_ = userAccessDB
	_ = mailAdapter

	userA, err := userAccessDB.Create("UserA", "123456789", "patiwatkrubst@hotmail.com")
	if err != nil {
		panic(err)
	}
	userB, err := userAccessDB.Create("UserB", "987654321", "patiwatkrubnd@hotmail.com")
	if err != nil {
		panic(err)
	}
	userC, err := userAccessDB.Create("UserC", "123456", "patiwatkrubst_pgo@outlook.com")
	if err != nil {
		panic(err)
	}

	terminal := []string{
		userA.Email,
		userB.Email,
		userC.Email,
	}

	mailAdapter.SetAddress(terminal)
	mailAdapter.SetContext()

	if err = mailAdapter.SendMail(); err != nil {
		panic(err)
	}
}
