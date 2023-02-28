package main

import (
	"log"
	"os"

	"gopkg.in/gomail.v2"
)

var mMailHost = "smtp.gmail.com"
var mMailPort = 587
var mMailUser = os.Getenv("GOMAIL_USERNAME")
var mMailPassword = os.Getenv("GOMAIL_PASSWORD")

func InitGoMail() *gomail.Dialer {
	log.Println("Initial... mail server")
	dial := gomail.NewDialer(mMailHost, mMailPort, mMailUser, mMailPassword)

	log.Println("Done...")
	return dial
}
