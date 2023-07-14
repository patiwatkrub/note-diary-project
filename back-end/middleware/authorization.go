package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/patiwatkrub/note-diary-project/back-end/utility"
)

// Authorization For check with:
// 1.Cookie Value
// 2.Validate Key
// 3.Key is valid and User is same person
func Authorization() gin.HandlerFunc {
	return func(ctx *gin.Context) {

		username := ctx.Param("username")

		cookie, err := ctx.Cookie("jwt-token-auth")
		if err != nil {
			ctx.AbortWithStatusJSON(401, gin.H{
				"unauthorized": err.Error(),
			})
			return
		}

		token, err := utility.ValidateToken(cookie)
		if err != nil {
			ctx.AbortWithStatusJSON(401, gin.H{
				"unauthorized": err.Error(),
			})

			return
		}

		if !token.Valid {
			ctx.AbortWithStatusJSON(401, gin.H{
				"unauthorized": err.Error(),
			})
			return
		}

		claims := token.Claims.(jwt.MapClaims)

		if claims["sub"] != username {
			ctx.AbortWithStatusJSON(406, gin.H{
				"not accepted": "token invalid",
			})
			return
		}

		ctx.Next()
	}
}
