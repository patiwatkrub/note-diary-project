package main

import (
	"github.com/patiwatkrub/note-diary-project/modelDB"
)

func main() {
	db := initDatabase()

	userAccessDB := modelDB.NewUserAccessingDB(db)
	_ = userAccessDB

	userAccessDB.Create("UserA", "123456789", "user_A@gmail.com")

}
