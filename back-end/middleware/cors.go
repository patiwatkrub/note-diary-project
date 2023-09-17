package middleware

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func CORSSetUp() gin.HandlerFunc {
	config := cors.DefaultConfig()
	// Can not use config AllowAllOrigins = true for allow all origins
	// config.AllowAllOrigins = true

	config.AllowOrigins = []string{"http://localhost:8080", "http://localhost:8081", "http://127.0.0.1:8080", "http://127.0.0.1:8081", "http://notediary:8080", "http://notediary:8081", "https://localhost:443", "https://localhost:444", "https://127.0.0.1:443", "https://127.0.0.1:444", "https://notediary:443", "https://notediary:444"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTION"}
	config.AllowHeaders = []string{"Content-Type", "Content-Length", "Accept-Encoding", "Multipart", "Authorization", "X-CSRF-Token", "X-Custom-Header", "X-Requested-With", "X-Max", "User"}
	config.AllowCredentials = true
	config.MaxAge = time.Duration(time.Duration.Hours(5))

	return cors.New(config)
}
