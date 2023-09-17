package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/patiwatkrub/note-diary-project/back-end/domains"
	"github.com/patiwatkrub/note-diary-project/back-end/logs"
	"github.com/patiwatkrub/note-diary-project/back-end/utility"
	"github.com/spf13/viper"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var sqlCommand string

type SqlLogger struct {
	logger.Interface
}

func (SqlLogger) Trace(ctx context.Context, begin time.Time, fc func() (sql string, rowsAffected int64), err error) {
	sql, _ := fc()
	sqlCommand = fmt.Sprintf("\n==================================================\n%v\n==================================================\n", sql)

	logs.Debug(sqlCommand)
}

func InitDatabase() *gorm.DB {
	logs.Info("Connecting... database")
	dsn := fmt.Sprintf("%v://%v:%v@%v:%v/%v?TimeZone=Asia/Bangkok",
		viper.GetString("db.driver"),
		viper.GetString("db.username"),
		viper.GetString("db.password"),
		viper.GetString("db.host"),
		viper.GetInt("db.port"),
		viper.GetString("db.database"))

	dial := postgres.Open(dsn)

	db, err := gorm.Open(dial, &gorm.Config{
		// Logger:      &SqlLogger{},
		DryRun:      false,
		QueryFields: true,
		NowFunc:     utility.GetTime,
	})

	if err != nil {
		log.Panic("ERROR! to connect database.")
	}

	db.AutoMigrate(&domains.User{}, &domains.Note{})

	// Change image profile URL
	// defaultImgEncoder := base64.StdEncoding.EncodeToString([]byte("http://notediary:8081/public/profile-photo-default.png"))
	// result := db.Exec("UPDATE users SET img_profile = ?", defaultImgEncoder)
	// if result.Error != nil {
	// 	panic(result.Error)
	// }

	logs.Info("Success...")
	return db
}
