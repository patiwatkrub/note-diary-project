package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/patiwatkrub/note-diary-project/back-end/logs"
	"github.com/patiwatkrub/note-diary-project/back-end/services"
	"github.com/patiwatkrub/note-diary-project/back-end/utility"
)

// For fix Sonar Lint duplicating

// Token parameter setting.

// Set a name cookie
var tokenKey string = "jwt-token-auth"

// initial domain path for set a cookie
// with a researching found. on local domain we must except to set a domain
var domainPath string = ""

// initial path to allow on domain
var initialPath string = "/"

// Set expire cookie
// 60 * 60 * 2,
// First 60 is 1 minutes,
// Next 60 is 60 minutes or 1 hours,
// 60 * 60 = 3600 seconds,
// PS: for set a cookie must use second unix.
// and then for setting 2 hour with multiply 2 equal 7200,
// so on testing we use 5 minutes and on production 2 hour,
var expireTime = 60 * 5

// set secure on cookie. PS: client must must have 'https' or 'ssl cert' for securing
// true is secure must have https protocol,
// false is note secure
var isSecure = false

// set cookie can access with languages such as Javascript, etc.
// true is can not access with JS,
// false is can access with JS
var isHttpOnly = true

var badRequestInvalidPwd string = "Password incorrect"
var badRequestInputEmpty string = "Input values are empty"
var badRequestPwdNotMatch string = "New Password is not match"

type userAccessController struct {
	userSRVI services.UserService
}

func NewUserAccessingController(userSRVI services.UserService) *userAccessController {
	return &userAccessController{userSRVI: userSRVI}
}

func (user *userAccessController) CreateUserAccount(ctx *gin.Context) {
	signInUsername := ctx.PostForm("reg-username")
	signInPassword := ctx.PostForm("reg-password")
	signInEmail := ctx.PostForm("reg-email")

	if err := user.userSRVI.CreateUserAccount(signInUsername, signInPassword, signInEmail); err != nil {
		ControllerError(ctx, err)
		return
	}

	ctx.JSON(201, gin.H{
		signInUsername: "created",
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

	// Guess setting for allow setCookie on front site. this is note true
	// Let's me explain about this
	// for allow setCookie on front-end site is depend on situation
	// on a mode below:
	// Lax mode - we can set cookie from different domain, port or not same origin but must GET method for receive.
	// Strict mode - we can set cookie on only same domain or origin.
	// None mode - is both on top but must have secure

	// so in situation of mine, must not any mode.
	// ctx.SetSameSite(http.SameSiteNoneMode)

	// Set cookie is expire in 2 hour(7200) and Time Zone GMT+7(25200)
	ctx.SetCookie(tokenKey, token, expireTime, initialPath, domainPath, isSecure, isHttpOnly)

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

	// ctx.SetSameSite(http.SameSiteNoneMode)

	ctx.SetCookie(tokenKey, cookie, expireTime, initialPath, domainPath, isSecure, isHttpOnly)

	ctx.Status(200)
}

func (user *userAccessController) LogOut(ctx *gin.Context) {
	username := ctx.Param("username")

	// ctx.SetSameSite(http.SameSiteNoneMode)
	ctx.SetCookie(tokenKey, "", -1, initialPath, domainPath, isSecure, isHttpOnly)

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

func (user *userAccessController) CheckEmail(ctx *gin.Context) {
	email := ctx.PostForm("verify-email")

	err := user.userSRVI.CheckEmail(email)
	if err != nil {
		ControllerError(ctx, err)
		return
	}

	ctx.Status(200)
}

func (user *userAccessController) ResetPassword(ctx *gin.Context) {
	email := ctx.PostForm("verify-email")
	resetPwd := ctx.PostForm("reset-password")

	aUser, err := user.userSRVI.ResetPassword(email, resetPwd)
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
	confirmNewPassword := ctx.PostForm("confirm-new-password")

	desireToChangeEmail := ctx.Query("change-email")
	desireToChangePassword := ctx.Query("change-password")

	if desireToChangeEmail == "1" && desireToChangePassword == "0" {
		if confirmPasswordEmail == "" || newEmail == "" {
			ctx.JSON(404, gin.H{
				"error": badRequestInputEmpty,
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
		if confirmPasswordPassword == "" || newPassword == "" || confirmNewPassword == "" {
			ctx.JSON(404, gin.H{
				"error": badRequestInputEmpty,
			})

			return
		}
		if newPassword != confirmNewPassword {
			ctx.JSON(404, gin.H{
				"error": badRequestPwdNotMatch,
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
			newEmail == "" || newPassword == "" ||
			confirmNewPassword == "" {
			ctx.JSON(400, gin.H{
				"error": badRequestInputEmpty,
			})
			return
		}

		if confirmPasswordEmail != confirmPasswordPassword {
			ctx.JSON(400, gin.H{
				"error": badRequestInvalidPwd,
			})
			return

		}

		if newPassword != confirmNewPassword {
			ctx.JSON(404, gin.H{
				"error": badRequestPwdNotMatch,
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
	imageName = "http://notediary:8081/public/" + imgFile.Filename

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

	ctx.SetCookie(tokenKey, "", -1, initialPath, domainPath, isSecure, isHttpOnly)

	ctx.JSON(200, gin.H{
		getUsernameFromParameter: "deleted",
	})
}
