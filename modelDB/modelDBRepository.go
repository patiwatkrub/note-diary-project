package modelDB

import (
	"gorm.io/gorm"
)

type modelDBRepository struct {
	postgresDB *gorm.DB
}

func NewModelDBRepository(postgresDB *gorm.DB) modelDBRepository {
	return modelDBRepository{postgresDB: postgresDB}
}

type NoteDiary struct {
	gorm.Model
	title string
	gerne Gerne
}

type Gerne struct {
	note     Note
	todolist TodoList
}

type Note struct {
	context string
}

type TodoList struct {
	context   string
	checkList bool
}
