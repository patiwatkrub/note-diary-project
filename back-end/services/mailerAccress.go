package services

import (
	"gopkg.in/gomail.v2"
)

type mailerAccess struct {
	mailer  *gomail.Dialer
	message *gomail.Message
}

func NewMailValidateAccess(mailer *gomail.Dialer) mailerAccess {
	massage := gomail.NewMessage()
	return mailerAccess{mailer: mailer,
		message: massage}
}

func (mail mailerAccess) SetAddress(to string) {
	mail.message.SetHeader("To", to)
}

func (mail mailerAccess) SetContext(from, subject, context string) {
	mail.message.SetHeader("From", from)
	mail.message.SetHeader("Subject", subject)
	mail.message.SetBody("text/html", context)
}

func (mail mailerAccess) SendMail() error {

	if err := mail.mailer.DialAndSend(mail.message); err != nil {
		return err
	}
	return nil
}
