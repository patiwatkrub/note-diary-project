package main

import (
	"fmt"

	"github.com/patiwatkrub/note-diary-project/modelDB"
)

func main() {
	db := initDatabase()

	userAccessDB := modelDB.NewUserAccessingDB(db)
	_ = userAccessDB

	userA, err := userAccessDB.Create("UserA", "123456789", "user_A@gmail.com")
	if err != nil {
		panic(err)
	}

	userA, err = userAccessDB.Verify(1)
	if err != nil {
		panic(err)
	}

	fmt.Println("Main: ", userA)
}
