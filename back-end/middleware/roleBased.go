package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
)

func RoleAdmin(ctx *gin.Context) {

	secretAdminKey := viper.GetString("app.secret_api_key")
	adminKey := ctx.Request.Header.Get("admin-key")

	if adminKey != secretAdminKey {
		ctx.AbortWithStatusJSON(403, gin.H{
			"forbidden": "not allow to access",
		})
	}

	ctx.Next()

}
