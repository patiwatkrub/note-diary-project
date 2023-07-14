package services

type EmailValidateInterface interface {
	SetAddress(string)
	SetContext(string, string, string)
	SendMail() error
}
