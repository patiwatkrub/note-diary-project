package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"githun.com/patiwatkrub/note-diary-project/modelDB"
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

func main() {
	dsn := "postgres://postgres:p@ssword@pgsql@localhost:5432/postgres?TimeZone=Asia/Bangkok"
	dial := postgres.Open(dsn)

	db, err := gorm.Open(dial, &gorm.Config{
		Logger: &SqlLogger{},
		DryRun: true,
	})

	if err != nil {
		log.Panic("ERROR! to connect database.")
	}
	db.AutoMigrate(&modelDB.User{})

	userAccessDB := modelDB.NewUserAccessingDB(db)

	_ = userAccessDB
	// userAccessDB.Create("UserA", "123456789", "user_A@gmail.com")
	// userAccessDB.Create("UserA", "123456789", "user_A@gmail.com")

}
