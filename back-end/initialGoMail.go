package main

import (
	"github.com/patiwatkrub/note-diary-project/back-end/logs"
	"github.com/spf13/viper"
	"gopkg.in/gomail.v2"
)

func InitGoMail() *gomail.Dialer {
	logs.Info("Initial... mail server")

	host := viper.GetString("mail.host")
	port := viper.GetInt("mail.port")
	username := viper.GetString("mail.username")
	password := viper.GetString("mail.password")

	dial := gomail.NewDialer(host, port, username, password)

	logs.Info("Done...")
	return dial
}
