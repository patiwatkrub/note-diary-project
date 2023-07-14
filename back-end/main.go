package main

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/patiwatkrub/note-diary-project/back-end/controllers"
	"github.com/patiwatkrub/note-diary-project/back-end/domains"
	"github.com/patiwatkrub/note-diary-project/back-end/middleware"
	"github.com/patiwatkrub/note-diary-project/back-end/services"
)

func main() {
	InitEnvironmentVariables()

	db := initDatabase()
	mailer := InitGoMail()

	// User End point
	userAccessDB := domains.NewUserAccessingDB(db)
	mailAdapter := services.NewMailValidateAccess(mailer)
	userAccessService := services.NewUserAccessingService(userAccessDB, mailAdapter)
	userAccessController := controllers.NewUserAccessingController(userAccessService)

	// Note End point
	noteAccessDB := domains.NewNoteAccessingDB(db)
	noteAccessService := services.NewNoteAccessingService(noteAccessDB)
	noteAccessController := controllers.NewNoteAccessingController(noteAccessService)

	router := gin.Default()
	router.Static("/public", "./public/img/")

	// Set a lower memory limit for multipart forms (default is 32 MiB)
	// 8 MiB
	router.MaxMultipartMemory = 8 << 20

	router.Use(middleware.CORSSetUp())

	// localhost:8080/note-diary-api
	api := router.Group("/note-diary-api")

	router.GET("/", func(c *gin.Context) {
		c.String(200, "Server is running on port %v", os.Getenv("PORT"))
	})

	// localhost:8080/note-diary-api/admin
	admin := api.Group("/admin", middleware.RoleAdmin)
	admin.GET("/users", userAccessController.GetUsers)
	admin.GET("/users-deleted", userAccessController.GetDeletedUsers)

	// localhost:8080/note-diary-api/user
	user := api.Group("/user")
	user.POST("/create", userAccessController.CreateUserAccount)

	user.GET("/:username", userAccessController.GetUser)
	user.GET("/:username/confirm", userAccessController.Verify)

	user.POST("", userAccessController.Login)

	// localhost:8080/note-diary-api/user/:username
	authorization := user.Group("/:username", middleware.Authorization())
	authorization.GET("/", userAccessController.ExtendToken)
	authorization.GET("/logout", userAccessController.LogOut)

	// Management user data
	authorization.POST("/edit/profile", userAccessController.ChosenEditProfile)
	authorization.POST("/edit/img-profile", userAccessController.UploadProfile)
	authorization.POST("/reset-password", userAccessController.ResetPassword)

	authorization.DELETE("/delete", userAccessController.DeleteUser)

	// Access note diary
	// localhost:8080/note-diary-api/user/:username/note
	noteDiary := authorization.Group("/note")
	noteDiary.POST("/create", noteAccessController.MakeNote)
	noteDiary.GET("/", noteAccessController.ShowNotes)

	// For fix Sonar Lint duplicating
	takeOneNote := "/:note-id"
	noteDiary.GET(takeOneNote, noteAccessController.ShowNote)
	noteDiary.PATCH(takeOneNote, noteAccessController.EditNote)
	noteDiary.DELETE(takeOneNote, noteAccessController.DeleteNote)

	http.ListenAndServe(os.Getenv("PORT"), router)
}
