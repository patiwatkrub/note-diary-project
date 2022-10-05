package main

import (
	"fmt"
)

func main() {
	var iGreeting interface{} = "hi there!"
	fmt.Println("Hello World!")

	// type to check string with interface
	if strGreet, ok := iGreeting.(string); ok {
		fmt.Println(strGreet)
	} else {
		fmt.Println("something wrong!, iGreeting isn't string type")
	}

}
