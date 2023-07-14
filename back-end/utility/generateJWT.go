package utility

import (
	"errors"
	"fmt"
	"os"

	"github.com/golang-jwt/jwt"
)

func CreateJWT(username string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, &jwt.StandardClaims{
		Subject:   username,
		ExpiresAt: GenerateExpireTime(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("SECRET_JWT_TOKEN_KEY")))
	if err != nil {
		err = errors.New("Internal Server Error")
		return "", err
	}
	return tokenString, nil
}

func ValidateToken(encodedToken string) (*jwt.Token, error) {
	return jwt.Parse(encodedToken, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unauthorized: you have not key to access")
		}

		return []byte(os.Getenv("SECRET_JWT_TOKEN_KEY")), nil
	})
}
