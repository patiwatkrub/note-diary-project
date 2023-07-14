package errs

type CustomError struct {
	StatusCode   int
	ErrorHeader  string
	ErrorMessage string
}

func (customError CustomError) Error() string {
	return customError.ErrorMessage
}

// Error: Notification on user to verify email
func NewEmailNotVerify() CustomError {
	return CustomError{
		StatusCode:   202,
		ErrorHeader:  "Warning",
		ErrorMessage: "You are not confirmation email, please check your email for successfully register",
	}
}

// Error: Invalid Email Format
func NewInvlidEmailPattern() CustomError {
	return CustomError{
		StatusCode:   400,
		ErrorHeader:  "Unsuccess",
		ErrorMessage: "We are serve mail domains on hotmail, gmail, yahoo etc",
	}
}

// Error: Compare between input password and user password is false
func NewInvalidPassword() CustomError {
	return CustomError{
		StatusCode:   400,
		ErrorHeader:  "Unsuccess",
		ErrorMessage: "Invalid Password",
	}
}

// Error: Invalid input to update a Note such as User Not Found on Author, NoteID is Not Found and Diary Type not compare lasted value
func NewInvalidDataToUpdateNote() CustomError {
	return CustomError{
		StatusCode:   400,
		ErrorHeader:  "Unsuccess",
		ErrorMessage: "Can not update a note with NoteID, Author and Diary type",
	}
}

// Error: Invalid input to get a Note such as User Not Found on Author and NoteID is Not Found
func NewInvalidNoteIDAndAuthor() CustomError {
	return CustomError{
		StatusCode:   400,
		ErrorHeader:  "Unsuccess",
		ErrorMessage: "Can not get a note with NoteID and Author",
	}
}

// Error: Invalid Author input to get notes
func NewInvlidAuthor() CustomError {
	return CustomError{
		StatusCode:   400,
		ErrorHeader:  "Unsuccess",
		ErrorMessage: "Can not get notes with author",
	}
}

// Error: Input is not correct formats
func NewBadRequest() CustomError {
	return CustomError{
		StatusCode:   400,
		ErrorHeader:  "Unsuccess",
		ErrorMessage: "Bad Request",
	}
}

// Error: Invalid username is not matching pattern
func NewInvalidUsernamePattern() CustomError {
	return CustomError{
		StatusCode:   404,
		ErrorHeader:  "Unsuccess",
		ErrorMessage: "Username and Password is invalid",
	}
}

// Error: Invalid username is not length more than 6 and less than 20
func NewInvalidUsernameLength() CustomError {
	return CustomError{
		StatusCode:   404,
		ErrorHeader:  "Unsuccess",
		ErrorMessage: "Username must be length more than 6 and less than 20",
	}
}

// Error: Invalid username and password input
func NewLoginFail() CustomError {
	return CustomError{
		StatusCode:   404,
		ErrorHeader:  "Unsuccess",
		ErrorMessage: "Username and Password is invalid",
	}
}

// Error: Can not fund user from database
func NewUserNotFound() CustomError {
	return CustomError{
		StatusCode:   404,
		ErrorHeader:  "Unsuccess",
		ErrorMessage: "User Not Found",
	}
}

// Error: Can not find an Author in User table to create note
func NewCreateNoteWithAuthorNotExist() CustomError {
	return CustomError{
		StatusCode:   500,
		ErrorHeader:  "Unsuccess",
		ErrorMessage: "Invalid Author name",
	}
}

// Error: Can not find an Author in User table to delete note
func NewDeleteNoteWithAuthorNotExist() CustomError {
	return CustomError{
		StatusCode:   500,
		ErrorHeader:  "Unsuccess",
		ErrorMessage: "Invalid Author name",
	}
}

// Error: Error can expected such as Error from generate encrypt password, generate JWT etc.
func NewInternalServerError() CustomError {
	return CustomError{
		StatusCode:   500,
		ErrorHeader:  "Unsuccess",
		ErrorMessage: "Internal Server Error",
	}
}

// Error: error can not decision or has multi direction
func NewUnexpected(err error) CustomError {
	return CustomError{
		StatusCode:   500,
		ErrorHeader:  "Unexpected",
		ErrorMessage: err.Error(),
	}
}
