package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/patiwatkrub/note-diary-project/back-end/logs"
	"github.com/patiwatkrub/note-diary-project/back-end/services"
	"github.com/patiwatkrub/note-diary-project/back-end/utility"
)

// For fix Sonar Lint duplicating
var tokenKey string = "jwt-token-auth"
var intialPath string = "/note-diary-api/"

var badRequestStr string = "Bad Request"

type userAccessController struct {
	userSRVI services.UserService
}

func NewUserAccessingController(userSRVI services.UserService) *userAccessController {
	return &userAccessController{userSRVI: userSRVI}
}

func (user *userAccessController) CreateUserAccount(ctx *gin.Context) {
	var aUser services.UserResponse
	err := ctx.ShouldBind(&aUser)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Status Bad Request"})
		return
	}

	if err := user.userSRVI.CreateUserAccount(aUser.Username, aUser.Password, aUser.Email); err != nil {
		ControllerError(ctx, err)
		return
	}

	ctx.JSON(201, gin.H{
		aUser.Username: "created",
	})
}

func (user *userAccessController) GetUser(ctx *gin.Context) {
	username := ctx.Param("username")

	getUser, err := user.userSRVI.GetUser(username)
	if err != nil {
		ControllerError(ctx, err)
		return
	}

	ctx.JSON(200, gin.H{
		"user": getUser,
	})
}

func (user *userAccessController) GetUsers(ctx *gin.Context) {
	getUsers, err := user.userSRVI.GetUsers()
	if err != nil {
		ControllerError(ctx, err)
		return
	}

	ctx.JSON(200, gin.H{
		"success": getUsers,
	})
}

func (user *userAccessController) GetDeletedUsers(ctx *gin.Context) {
	deletedUsers, err := user.userSRVI.GetDeletedUsers()
	if err != nil {
		ControllerError(ctx, err)
		return
	}

	ctx.JSON(200, gin.H{
		"user is deleted": deletedUsers,
	})
}

func (user *userAccessController) Login(ctx *gin.Context) {
	username := ctx.PostForm("username")
	password := ctx.PostForm("password")

	success, verifiedStatus, errS := user.userSRVI.Login(username, password)
	if errS != nil && verifiedStatus != 0 {
		ControllerError(ctx, errS)
		return
	}

	token, err := utility.CreateJWT(username)
	if err != nil {
		ctx.JSON(500, err)
		return
	}

	// ctx.SetSameSite(http.SameSiteLaxMode)
	// Set cookie is expire in 2 hour(7200) and Time Zone GMT+7(25200)
	ctx.SetCookie(tokenKey, token, 7200+25200, intialPath, "localhost", false, true)

	if verifiedStatus == 0 {
		ctx.JSON(200, gin.H{
			"Warning": errS.Error(),
			"token":   token,
			"user":    success.Username,
		})
		return
	}

	ctx.JSON(202, gin.H{
		"token": token,
		"user":  success.Username,
	})

	logs.Info(success.Username + ", Login successfully...")
	// ctx.Redirect(302, "http://localhost:5000/public/homepage.html")
}

func (user *userAccessController) ExtendToken(ctx *gin.Context) {
	cookie, _ := ctx.Cookie(tokenKey)

	token, _ := utility.ValidateToken(cookie)

	claims := token.Claims.(jwt.MapClaims)
	claims["exp"] = utility.GenerateExpireTime()

	ctx.SetCookie(tokenKey, cookie, 7200+25200, intialPath, "localhost", false, true)

	ctx.Status(200)
}

func (user *userAccessController) LogOut(ctx *gin.Context) {
	username := ctx.Param("username")

	ctx.SetCookie(tokenKey, "", -1, intialPath, "localhost", false, true)

	ctx.JSON(200, gin.H{
		username: "is log out",
	})
}

func (user *userAccessController) Verify(ctx *gin.Context) {
	username := ctx.Param("username")

	if err := user.userSRVI.Verify(username); err != nil {
		ctx.JSON(400, gin.H{
			"unsuccess": err.Error(),
		})
		return
	}

	ctx.JSON(200, gin.H{
		"user": "confirmation success",
	})
}

func (user *userAccessController) ResetPassword(ctx *gin.Context) {
	username := ctx.Param("username")

	email := ctx.PostForm("verify-email")
	resetPwd := ctx.PostForm("reset-password")

	aUser, err := user.userSRVI.ResetPassword(username, email, resetPwd)
	if err != nil {
		ControllerError(ctx, err)
		return
	}

	ctx.JSON(200, gin.H{
		"success": aUser,
	})
}

func (user *userAccessController) ChosenEditProfile(ctx *gin.Context) {

	getUsernameFromParameter := ctx.Param("username")

	confirmPasswordEmail := ctx.PostForm("confirm-password-to-change-email")
	confirmPasswordPassword := ctx.PostForm("confirm-password-to-change-password")
	newEmail := ctx.PostForm("user-email")
	newPassword := ctx.PostForm("new-password")

	desireToChangeEmail := ctx.Query("change-email")
	desireToChangePassword := ctx.Query("change-password")

	if desireToChangeEmail == "1" && desireToChangePassword == "0" {
		if confirmPasswordEmail == "" || newEmail == "" {
			ctx.JSON(404, gin.H{
				"error": badRequestStr,
			})
			return
		}
		getResponse, err := user.userSRVI.ChangeEmail(getUsernameFromParameter, confirmPasswordEmail, newEmail)
		if err != nil {
			ctx.JSON(500, gin.H{
				"error": err.Error(),
			})
			return
		}

		ctx.JSON(202, gin.H{
			"success": getResponse,
		})

		return
	} else if desireToChangeEmail == "0" && desireToChangePassword == "1" {
		if confirmPasswordPassword == "" || newPassword == "" {
			ctx.JSON(404, gin.H{
				"error": badRequestStr,
			})

			return
		}
		getResponse, err := user.userSRVI.ChangePassword(getUsernameFromParameter, confirmPasswordPassword, newPassword)
		if err != nil {
			ctx.JSON(500, gin.H{
				"error": err.Error(),
			})
			return
		}

		ctx.JSON(202, gin.H{
			"success": getResponse,
		})

		return
	} else if desireToChangeEmail == "1" && desireToChangePassword == "1" {
		if confirmPasswordEmail == "" || confirmPasswordPassword == "" ||
			newEmail == "" || newPassword == "" {
			ctx.JSON(400, gin.H{
				"error": badRequestStr,
			})
			return
		}

		if confirmPasswordEmail != confirmPasswordPassword {
			ctx.JSON(400, gin.H{
				"error": badRequestStr,
			})
			return

		}

		password := confirmPasswordPassword

		getResponse, err := user.userSRVI.ChangeEmailAndPassword(getUsernameFromParameter, password, newEmail, newPassword)
		if err != nil {
			ctx.JSON(500, gin.H{
				"error": err.Error(),
			})
			return
		}

		ctx.JSON(202, gin.H{
			"success": getResponse,
		})

		return
	}
}

func (user *userAccessController) UploadProfile(ctx *gin.Context) {

	getUsernameFromParameter := ctx.Param("username")

	imgFile, err := ctx.FormFile("upload-img")
	if err != nil {
		ctx.JSON(500, gin.H{
			"unsuccess": err.Error(),
		})
		return
	}

	// Upload the file to specific dst.
	dist := `public/img/`
	imageName := dist + imgFile.Filename

	ctx.SaveUploadedFile(imgFile, imageName)

	// rename path can relative in frontend
	imageName = "/public/" + imgFile.Filename

	getUser, err := user.userSRVI.UploadImgProfile(getUsernameFromParameter, imageName)
	if err != nil {
		ControllerError(ctx, err)
		return
	}

	ctx.JSON(200, gin.H{
		"success": getUser,
	})
}

func (user *userAccessController) DeleteUser(ctx *gin.Context) {

	getUsernameFromParameter := ctx.Param("username")

	err := user.userSRVI.DeleteUser(getUsernameFromParameter)
	if err != nil {
		ctx.JSON(500, gin.H{
			"unsuccess": err.Error(),
		})
		return
	}

	ctx.SetCookie("jwt-token-auth", "", -1, "/note-diary-api/", "localhost", false, true)

	ctx.JSON(200, gin.H{
		getUsernameFromParameter: "deleted",
	})
}
