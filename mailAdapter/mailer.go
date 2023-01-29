package mailAdapter

// storing struct for variants send mail future
type EmailValidate struct {
	From    string
	To      []string
	Subject string
}

type EmailValidateInterface interface {
	SetAddress([]string)
	SetContext()
	SendMail() error
}
