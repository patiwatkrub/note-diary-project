package middleware

import (
	"os"

	"github.com/gin-gonic/gin"
)

func RoleAdmin(ctx *gin.Context) {

	secretAdminKey := os.Getenv("SECRET_API_KEY")
	adminKey := ctx.Request.Header.Get("admin-key")

	if adminKey != secretAdminKey {
		ctx.AbortWithStatusJSON(403, gin.H{
			"forbidden": "not allow to access",
		})
	}

	ctx.Next()

}
