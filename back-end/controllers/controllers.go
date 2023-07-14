package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/patiwatkrub/note-diary-project/back-end/errs"
	"github.com/patiwatkrub/note-diary-project/back-end/logs"
)

func ControllerError(ctx *gin.Context, err error) {
	switch eType := err.(type) {
	case errs.CustomError:
		ctx.JSON(eType.StatusCode, gin.H{
			eType.ErrorHeader: eType.ErrorMessage,
		})
	case error:
		logs.Debug(eType)
		ctx.JSON(500, gin.H{
			"Unsuccess": "Unexpected: " + err.Error(),
		})
	}
}
