package mailAdapter

import (
	"gopkg.in/gomail.v2"
)

type mailerAccess struct {
	// insert type of gomail
	mailer  *gomail.Dialer
	message *gomail.Message
}

func NewMailValidateAccess(mailer *gomail.Dialer) mailerAccess {
	massage := gomail.NewMessage()
	return mailerAccess{mailer: mailer,
		message: massage}
}

func (mail *mailerAccess) SetAddress(to []string) {
	mail.message.SetHeader("To", to...)
}

func (mail *mailerAccess) SetContext() {
	mail.message.SetHeader("From", "patiwatkongram@gmail.com")
	mail.message.SetHeader("Subject", "Note-diary verification email.")
	mail.message.SetBody("text/html", `Hello sir <i>...</i><br> <div>Please, verification your account follow into <a href="https://www.google.co.th">demo link url</a></div>`)
}

func (mail *mailerAccess) SendMail() error {

	if err := mail.mailer.DialAndSend(mail.message); err != nil {
		return err
	}
	return nil
}
