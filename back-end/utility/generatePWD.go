package utility

import (
	bcrypt "golang.org/x/crypto/bcrypt"
)

var standardCost int = 10

func ComparePassword(hashedPWD, pwd string) (bool, error) {
	result := bcrypt.CompareHashAndPassword([]byte(hashedPWD), []byte(pwd))
	if result != nil {
		return false, result
	}

	return true, nil
}

func EncyptPassword(pwd string) (string, error) {
	encryptPWD, err := bcrypt.GenerateFromPassword([]byte(pwd), standardCost)
	if err != nil {
		return "", err
	}

	strEncryptPWD := string(encryptPWD)
	return strEncryptPWD, nil
}
