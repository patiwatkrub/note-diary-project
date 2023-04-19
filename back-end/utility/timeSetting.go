package utility

import (
	"time"
)

const timeSettingFormat string = "Mon, 02 Jan 2020 15:04:05 UTC"
const ianaDBTimezone string = "Asia/Bangkok"

func init() {
	location, err := time.LoadLocation(ianaDBTimezone)
	if err != nil {
		panic(err)
	}

	time.Local = location
}

func GetTime() time.Time {
	t, err := time.Parse(time.RFC1123, timeSettingFormat)
	if err != nil {
		panic(err)
	}
	return t
}
