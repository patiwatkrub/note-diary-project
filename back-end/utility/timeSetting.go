package utility

import (
	"fmt"
	"time"
)

const ianaDBTimezone string = "Asia/Bangkok"

func init() {
	location, err := time.LoadLocation(ianaDBTimezone)
	if err != nil {
		panic(err)
	}

	time.Local = location
}

func GetTime() time.Time {
	date := time.Now().Local()

	shortDay := date.Weekday().String()[0:3]

	shortMonth := date.Month().String()[0:3]

	t, err := time.Parse(time.RFC1123, fmt.Sprintf("%v, %02d %v %v %02d:%02d:%02d GMT",
		shortDay, date.Day(), shortMonth, date.Year(),
		date.Hour(), date.Minute(), date.Second()))
	if err != nil {
		panic(err)
	}
	return t
}

func GenerateExpireTime() int64 {
	issueTime := GetTime().Add(time.Minute * 120).Unix()
	return issueTime
}
