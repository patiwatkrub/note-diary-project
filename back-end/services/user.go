package services

type UserResponse struct {
	UserID   uint   `json:"user_id"`
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email"`
}

type UserService interface {
	CreateUserAccount(string, string, string) error
	GetUser(int) (UserResponse, error)
	GetUsers() ([]UserResponse, error)
	Verify(int) (UserResponse, error)
	ChangePassword(int, string) (UserResponse, error)
	ChangeEmail(string, string) (UserResponse, error)
	DeleteUser(int) error
}
