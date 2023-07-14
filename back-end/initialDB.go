package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/patiwatkrub/note-diary-project/back-end/domains"
	"github.com/patiwatkrub/note-diary-project/back-end/logs"
	"github.com/patiwatkrub/note-diary-project/back-end/utility"
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

func initDatabase() *gorm.DB {
	logs.Info("Connecting... database")
	dsn := fmt.Sprintf("%v://%v:%v@%v:%v/%v?TimeZone=Asia/Bangkok",
		os.Getenv("POSTGRES_DRIVER"),
		os.Getenv("POSTGRES_USERNAME"),
		os.Getenv("POSTGRES_PASSWORD"),
		os.Getenv("POSTGRES_HOST"),
		os.Getenv("POSTGRES_PORT"),
		os.Getenv("POSTGRES_DATABASE"))

	dial := postgres.Open(dsn)

	db, err := gorm.Open(dial, &gorm.Config{
		Logger:      &SqlLogger{},
		DryRun:      false,
		QueryFields: true,
		NowFunc:     utility.GetTime,
	})

	if err != nil {
		log.Panic("ERROR! to connect database.")
	}
	db.AutoMigrate(&domains.User{}, &domains.Note{})

	logs.Info("Success...")
	return db
}
