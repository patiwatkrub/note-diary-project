package services

import (
	"strconv"

	"github.com/google/uuid"
	"github.com/patiwatkrub/note-diary-project/back-end/domains"
	"github.com/patiwatkrub/note-diary-project/back-end/errs"
	"github.com/patiwatkrub/note-diary-project/back-end/logs"
)

type noteAccessService struct {
	noteDBI domains.NoteInterface
}

func NewNoteAccessingService(noteDBI domains.NoteInterface) NoteService {
	return &noteAccessService{noteDBI: noteDBI}
}

func (note *noteAccessService) MakeNote(noteReq NoteRequest) (*NoteResponse, error) {
	randUuid := uuid.NewString()

	diaryType, err := strconv.Atoi(noteReq.DiaryType)
	if err != nil {
		logs.Error(err)
		return nil, errs.NewInternalServerError()
	}

	getNote, err := note.noteDBI.CreateNote(randUuid, noteReq.Author, noteReq.Title, diaryType, noteReq.Detail)
	if err != nil {
		logs.Error(err)
		return nil, errs.NewCreateNoteWithAuthorNotExist()
	}

	noteRes := NewNoteResponse(getNote.NoteID, getNote.Title, getNote.DiaryType, getNote.Detail, getNote.Author, getNote.CreatedAt, getNote.UpdatedAt)

	return noteRes, nil
}
func (note *noteAccessService) ShowNote(noteID, author string) (*NoteResponse, error) {
	getNote, err := note.noteDBI.GetNote(noteID, author)
	if err != nil {
		logs.Error(err)
		return nil, errs.NewInvalidNoteIDAndAuthor()
	}

	noteRes := NewNoteResponse(getNote.NoteID, getNote.Title, getNote.DiaryType, getNote.Detail, getNote.Author, getNote.CreatedAt, getNote.UpdatedAt)

	return noteRes, nil
}
func (note *noteAccessService) ShowNotes(author string) ([]NoteResponse, error) {
	getNotes, err := note.noteDBI.GetNotes(author)
	if err != nil {
		logs.Error(err)
		return []NoteResponse{}, errs.NewInvlidAuthor()
	}

	var notes []NoteResponse

	for _, note := range getNotes {

		notes = append(notes, NoteResponse{
			NoteID:    note.NoteID,
			Title:     note.Title,
			DiaryType: note.DiaryType,
			Detail:    note.Detail,
			Author:    note.Author,
			CreatedAt: note.CreatedAt,
			UpdatedAt: note.UpdatedAt,
		})

	}

	return notes, nil
}
func (note *noteAccessService) EditNote(noteReq NoteRequest) (*NoteResponse, error) {
	diaryType, err := strconv.Atoi(noteReq.DiaryType)
	if err != nil {
		logs.Error(err)
		return nil, errs.NewInternalServerError()
	}

	getNote, err := note.noteDBI.UpdateNote(noteReq.NoteID, noteReq.Author, diaryType, noteReq.Detail)
	if err != nil {
		logs.Error(err)
		return nil, errs.NewInvalidDataToUpdateNote()
	}

	noteRes := NewNoteResponse(getNote.NoteID, getNote.Title, getNote.DiaryType, getNote.Detail, getNote.Author, getNote.CreatedAt, getNote.UpdatedAt)

	return noteRes, nil
}
func (note *noteAccessService) DeleteNote(noteID, author string) error {
	err := note.noteDBI.DeleteNote(noteID, author)
	if err != nil {
		logs.Error(err)
		return errs.NewDeleteNoteWithAuthorNotExist()
	}
	return nil
}
