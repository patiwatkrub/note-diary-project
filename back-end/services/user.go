package services

type UserResponse struct {
	Username    string `json:"username" form:"reg-username" binding:"required"`
	Password    string `json:"password" form:"reg-password" binding:"required"`
	Email       string `json:"email" form:"reg-email" binding:"required"`
	Img_Profile string `json:"img_profile" binding:"-"`
}

func NewUserResponse(username, password, email, imgProfile string) *UserResponse {
	return &UserResponse{
		Username:    username,
		Password:    password,
		Email:       email,
		Img_Profile: imgProfile,
	}
}

type UserService interface {
	CreateUserAccount(string, string, string) error
	GetUser(string) (*UserResponse, error)
	GetUsers() ([]UserResponse, error)
	GetDeletedUsers() ([]UserResponse, error)
	Login(string, string) (*UserResponse, int, error)
	Verify(string) error
	ResetPassword(string, string, string) (*UserResponse, error)
	ChangePassword(string, string, string) (*UserResponse, error)
	ChangeEmail(string, string, string) (*UserResponse, error)
	ChangeEmailAndPassword(string, string, string, string) (*UserResponse, error)
	UploadImgProfile(string, string) (*UserResponse, error)
	DeleteUser(string) error
}
