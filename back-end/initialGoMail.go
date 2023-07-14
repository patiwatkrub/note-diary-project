package main

import (
	"os"
	"strconv"

	"github.com/patiwatkrub/note-diary-project/back-end/logs"
	"gopkg.in/gomail.v2"
)

func InitGoMail() *gomail.Dialer {
	logs.Info("Initial... mail server")

	host := os.Getenv("GOMAIL_host")
	port, err := strconv.Atoi(os.Getenv("GOMAIL_PORT"))
	if err != nil {
		panic(err)
	}
	username := os.Getenv("GOMAIL_USERNAME")
	password := os.Getenv("GOMAIL_PASSWORD")

	dial := gomail.NewDialer(host, port, username, password)

	logs.Info("Done...")
	return dial
}
