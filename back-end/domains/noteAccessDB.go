package domains

import (
	"errors"
	"fmt"

	"github.com/patiwatkrub/note-diary-project/back-end/logs"
	"gorm.io/gorm"
)

// For fix Sonar Lint duplicating
var preloadArs string = "username = ?"

type noteAccessDB struct {
	db *gorm.DB
}

func NewNoteAccessingDB(db *gorm.DB) NoteInterface {
	return &noteAccessDB{db: db}
}

func (note noteAccessDB) CreateNote(note_id string, author string, title string, diaryType int, detail string) (aNote *Note, err error) {
	tx := note.db.Begin()

	fmt.Println("Author : ", author)

	// Instance value to Note
	aNote = &Note{
		NoteID:    note_id,
		Title:     title,
		DiaryType: diaryType,
		Detail:    detail,
		Author:    author,
	}

	related := tx.Preload("CreatedBy", preloadArs, aNote.Author).Find(&aNote)

	if err = related.Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	if aNote.CreatedBy == nil {
		tx.Rollback()
		err = errors.New("can not create a note with author")
		return nil, err
	}

	fmt.Printf("%+v", aNote)

	result := note.db.Create(&aNote)

	if result.Error != nil {
		tx.Rollback()
		err = errors.New("can not record note data")
		logs.Debug(err)
		return nil, err
	}

	return aNote, nil
}

func (note noteAccessDB) GetNote(note_id, author string) (aNote *Note, err error) {

	tx := note.db.Begin()

	aNote = &Note{
		Author: author,
	}

	related := tx.Where("note_id = ?", note_id).Preload("CreatedBy", preloadArs, author).Take(&aNote)

	if err = related.Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	if aNote.CreatedBy == nil {
		tx.Rollback()
		err = errors.New("can not get a note with noteID and author")
		return nil, err
	}

	return aNote, nil
}

func (note noteAccessDB) GetNotes(author string) (notes []Note, err error) {

	queryStm := "SELECT note_id, title, diary_type, detail, author, created_at, updated_at FROM notes WHERE author = ?"
	related := note.db.Preload("CreatedBy").Raw(queryStm, author).Scan(&notes)

	if related.Error != nil {
		return []Note{}, related.Error
	}

	if related.RowsAffected == 0 {
		err := errors.New("can not get notes with author")
		return []Note{}, err
	}

	return notes, nil
}

func (note noteAccessDB) UpdateNote(note_id string, author string, diaryType int, detail string) (aNote *Note, err error) {
	tx := note.db.Begin()

	aNote = &Note{
		Author: author,
	}

	result := tx.Where("note_id", note_id).Preload("CreatedBy", preloadArs, author).Take(&aNote)

	if result.Error != nil {
		tx.Rollback()
		return nil, err
	}

	if aNote.CreatedBy == nil {
		tx.Rollback()
		err = errors.New("can not update a note with author")
		return nil, err
	}

	if aNote.DiaryType != diaryType {
		tx.Rollback()
		err = errors.New("can not update a note with invalid diary type")
		return nil, err
	}

	aNote.Detail = detail

	updatedNoteDetailStm := tx.Save(&aNote)
	if updatedNoteDetailStm.Error != nil {
		tx.Rollback()
		err = errors.New("can not update note data for change detail")
		return nil, err
	}

	tx.Commit()

	return aNote, nil
}

func (note noteAccessDB) DeleteNote(note_id, author string) error {
	tx := note.db.Begin()

	aNote := &Note{
		Author: author,
	}

	result := tx.Where("note_id", note_id).Preload("CreatedBy", preloadArs, author).Take(&aNote)
	if result.Error != nil {
		tx.Rollback()
		return result.Error
	}

	if aNote.CreatedBy == nil {
		tx.Rollback()
		err := errors.New("user not found")
		return err
	}

	err := tx.Where("note_id = ?", note_id).Delete(aNote)
	if err.Error != nil {
		tx.Rollback()
		return err.Error
	}

	tx.Commit()

	return nil
}
