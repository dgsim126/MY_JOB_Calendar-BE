const express = require('express');
const router = express.Router();
const asyncHandler = require("express-async-handler");
const {verifyToken} = require('../../middleware/token');
const { 
    showAll,
    createComment,
    deleteComment
} = require('../../controllers/StudyBoard/studyboardCommentController');

// const verifyToken = require('../middleware/token');

// 특정 게시글 댓글 전체 가져오기
router.get('/:studyboardkey', verifyToken, showAll);

// 특정 게시글 댓글 생성
router.post('/create/:studyboardkey', verifyToken, asyncHandler(createComment));

// 특정 게시글 댓글 삭제
router.delete('/delete/:studyboardkey/:commentkey', verifyToken, asyncHandler(deleteComment));


module.exports = router;