package main

import (
	"os"

	"gopkg.in/gomail.v2"
)

var mMailHost = "smtp.gmail.com"
var mMailPort = 587
var mMailUser = os.Getenv("GOMAIL_USERNAME")
var mMailPassword = os.Getenv("GOMAIL_PASSWORD")

func InitGoMail() *gomail.Dialer {
	dial := gomail.NewDialer(mMailHost, mMailPort, mMailUser, mMailPassword)

	return dial
}
