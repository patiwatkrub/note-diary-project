package utility

import (
	"errors"
	"fmt"

	"github.com/golang-jwt/jwt"
	"github.com/spf13/viper"
)

func CreateJWT(username string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, &jwt.StandardClaims{
		Subject:   username,
		ExpiresAt: GenerateExpireTime(),
	})

	tokenString, err := token.SignedString([]byte(viper.GetString("app.secret_jwt_key")))
	if err != nil {
		err = errors.New("internal server error")
		return "", err
	}
	return tokenString, nil
}

func ValidateToken(encodedToken string) (*jwt.Token, error) {
	return jwt.Parse(encodedToken, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unauthorized: you have not key to access")
		}

		return []byte(viper.GetString("app.secret_jwt_key")), nil
	})
}
