package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/patiwatkrub/note-diary-project/modelDB"
	"github.com/patiwatkrub/note-diary-project/utility"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type SqlLogger struct {
	logger.Interface
}

func (SqlLogger) Trace(ctx context.Context, begin time.Time, fc func() (sql string, rowsAffected int64), err error) {
	sql, _ := fc()
	fmt.Printf("%v\n==================================================\n", sql)
}

func initDatabase() *gorm.DB {
	dsn := fmt.Sprintf("%v://%v:%v@%v:%v/%v?TimeZone=Asia/Bangkok",
		os.Getenv("POSTGRES_DRIVER"),
		os.Getenv("POSTGRES_USERNAME"),
		os.Getenv("POSTGRES_PASSWORD"),
		"localhost",
		os.Getenv("POSTGRES_PORT"),
		"postgres")

	dial := postgres.Open(dsn)

	db, err := gorm.Open(dial, &gorm.Config{
		Logger:  &SqlLogger{},
		DryRun:  true,
		NowFunc: utility.GetTime,
	})

	if err != nil {
		log.Panic("ERROR! to connect database.")
	}
	db.AutoMigrate(&modelDB.User{})

	return db
}
