package services

import (
	"time"
)

type NoteRequest struct {
	NoteID    string `form:"note-id"`
	Title     string `form:"title" binding:"required"`
	DiaryType string `form:"diary-type" binding:"required"`
	Detail    string `form:"detail" binding:"required"`
	Author    string `form:"author"`
}

type NoteResponse struct {
	NoteID    string
	Title     string
	DiaryType int
	Detail    string
	Author    string
	CreatedAt time.Time
	UpdatedAt time.Time
}

func NewNoteResponse(note_id string, title string, diaryType int, detail string, author string, createdAt time.Time, updatedAt time.Time) *NoteResponse {
	return &NoteResponse{
		NoteID:    note_id,
		Title:     title,
		DiaryType: diaryType,
		Detail:    detail,
		Author:    author,
		CreatedAt: createdAt,
		UpdatedAt: updatedAt,
	}
}

type NoteService interface {
	MakeNote(NoteRequest) (*NoteResponse, error)
	ShowNote(string, string) (*NoteResponse, error)
	ShowNotes(string) ([]NoteResponse, error)
	EditNote(NoteRequest) (*NoteResponse, error)
	DeleteNote(string, string) error
}
