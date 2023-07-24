package main

import (
	"strings"

	"github.com/spf13/viper"
)

func InitEnvironmentVariables() {
	viper.AddConfigPath(".")
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AutomaticEnv()
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

	err := viper.ReadInConfig()
	if err != nil {
		panic("Error loading .env file in viper library")
	}
}
