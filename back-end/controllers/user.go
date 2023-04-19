package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/patiwatkrub/note-diary-project/back-end/services"
)

type userAccessController struct {
	userSRVI services.UserService
}

func NewUserAccessingController(userSRVI services.UserService) userAccessController {
	return userAccessController{userSRVI: userSRVI}
}

func (user userAccessController) CreateUserAccount(ctx *gin.Context) {
	var u services.UserService

	ctx.BindJSON(&u)
}

func (user userAccessController) GetUser(ctx *gin.Context) {

}

func (user userAccessController) GetUsers(ctx *gin.Context) {

}

func (user userAccessController) Verify(ctx *gin.Context) {

}

func (user userAccessController) ChangePassword(ctx *gin.Context) {

}

func (user userAccessController) ChangeEmail(ctx *gin.Context) {

}

func (user userAccessController) DeleteUser(ctx *gin.Context) {

}
