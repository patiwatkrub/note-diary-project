package main

import (
	"github.com/joho/godotenv"
)

func InitEnvironmentVariables() {
	err := godotenv.Load()
	if err != nil {
		panic("Error loading .env file")
	}
}
