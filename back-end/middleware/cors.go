package middleware

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func CORSSetUp() gin.HandlerFunc {

	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "Head", "OPTIONS"}
	config.AllowHeaders = []string{"Content-Type", "Content-Length", "Accept-Encoding", "User", "Authorization", "X-CSRF-Token", "X-Custom-Header", "X-Max"}
	config.AllowCredentials = true
	config.MaxAge = time.Duration(time.Duration.Hours(5))

	return cors.New(config)
}
