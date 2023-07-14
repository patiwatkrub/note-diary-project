package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/patiwatkrub/note-diary-project/back-end/services"
)

var usernameKey string = "username"
var noteIDKey string = "note-id"
var titleKey string = "title"
var diaryTypeKey string = "diary-type"
var detailKey string = "detail"

type noteAccessController struct {
	noteSrvI services.NoteService
}

func NewNoteAccessingController(noteSrvI services.NoteService) *noteAccessController {
	return &noteAccessController{noteSrvI: noteSrvI}
}

func (note *noteAccessController) MakeNote(ctx *gin.Context) {
	author := ctx.Param(usernameKey)

	title := ctx.PostForm(titleKey)
	diaryType := ctx.PostForm(diaryTypeKey)
	detail := ctx.PostForm(detailKey)

	noteReq := services.NoteRequest{
		Title:     title,
		DiaryType: diaryType,
		Detail:    detail,
		Author:    author,
	}

	noteRes, err := note.noteSrvI.MakeNote(noteReq)
	if err != nil {
		ControllerError(ctx, err)
		return
	}

	ctx.JSON(201, gin.H{
		"success": noteRes,
	})
}
func (note *noteAccessController) ShowNote(ctx *gin.Context) {

	author := ctx.Param(usernameKey)
	noteID := ctx.Param(noteIDKey)

	noteRes, err := note.noteSrvI.ShowNote(noteID, author)
	if err != nil {
		ControllerError(ctx, err)
		return
	}

	ctx.JSON(200, gin.H{
		"Note": noteRes,
	})

}
func (note *noteAccessController) ShowNotes(ctx *gin.Context) {
	author := ctx.Param(usernameKey)
	notesRes, err := note.noteSrvI.ShowNotes(author)
	if err != nil {
		ControllerError(ctx, err)
		return
	}

	ctx.JSON(200, gin.H{
		"Notes": notesRes,
	})
}
func (note *noteAccessController) EditNote(ctx *gin.Context) {
	author := ctx.Param(usernameKey)
	noteID := ctx.Param(noteIDKey)

	title := ctx.PostForm(titleKey)
	diaryType := ctx.PostForm(diaryTypeKey)
	detail := ctx.PostForm(detailKey)

	noteReq := services.NoteRequest{
		NoteID:    noteID,
		Title:     title,
		DiaryType: diaryType,
		Detail:    detail,
		Author:    author,
	}

	noteRes, err := note.noteSrvI.EditNote(noteReq)
	if err != nil {
		ControllerError(ctx, err)
		return
	}

	ctx.JSON(200, gin.H{
		"Note": noteRes,
	})
}
func (note *noteAccessController) DeleteNote(ctx *gin.Context) {
	author := ctx.Param(usernameKey)
	noteID := ctx.Param(noteIDKey)

	if err := note.noteSrvI.DeleteNote(noteID, author); err != nil {
		ControllerError(ctx, err)
		return
	}

	ctx.JSON(200, gin.H{
		noteID: "is deleted",
	})
}
