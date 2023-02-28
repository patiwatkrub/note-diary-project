package domains

// storing struct for variants send mail future (In a right way, could move struct to business models and mapping json type)
type EmailValidate struct {
	From    string
	To      []string
	Subject string
}

type EmailValidateInterface interface {
	SetAddress(string)
	SetContext(string, string, string)
	SendMail() error
}
