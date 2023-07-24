package logs

import (
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var log *zap.Logger

func init() {
	var err error

	config := zap.NewDevelopmentConfig()
	config.EncoderConfig.TimeKey = "At Time"
	config.EncoderConfig.EncodeTime = zapcore.RFC3339TimeEncoder
	config.DisableStacktrace = true

	log, err = config.Build(zap.AddCallerSkip(1))

	if err != nil {
		panic(err)
	}
}

func Info(message interface{}, fields ...zap.Field) {
	switch eType := message.(type) {
	case error:
		log.Log(zap.InfoLevel, eType.Error(), fields...)
	case string:
		log.Log(zap.InfoLevel, eType, fields...)
	}
}

func Debug(message interface{}, fields ...zap.Field) {
	switch eType := message.(type) {
	case error:
		log.Debug(eType.Error(), fields...)
	case string:
		log.Debug(eType, fields...)
	}
}

func Error(message interface{}, fields ...zap.Field) {
	switch eType := message.(type) {
	case error:
		log.Error(eType.Error(), fields...)
	case string:
		log.Error(eType, fields...)
	}

}
