package domains

import (
	"time"
)

type Note struct {
	NoteID    string `gorm:"column:note_id;type:uuid;primaryKey;unique;not null"`
	Title     string `gorm:"type:varchar(100);not null"`
	DiaryType int    `gorm:"not null;default:0"`
	Detail    string `gorm:"type:text"`
	Author    string `gorm:"varchar(20);not null"`
	CreatedBy *User  `gorm:"foreignKey:Author;references:Username"`
	CreatedAt time.Time
	UpdatedAt time.Time
}

type NoteInterface interface {
	CreateNote(string, string, string, int, string) (*Note, error)
	GetNote(string, string) (*Note, error)
	GetNotes(string) ([]Note, error)
	UpdateNote(string, string, int, string) (*Note, error)
	DeleteNote(string, string) error
}
