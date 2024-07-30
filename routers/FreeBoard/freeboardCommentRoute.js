const express = require('express');
const router = express.Router();
const asyncHandler = require("express-async-handler");
const {verifyToken} = require('../../middleware/token');
const { 
    showAll,
    createComment,
    deleteComment
} = require('../../controllers/FreeBoard/freeboardCommentController');

// const verifyToken = require('../middleware/token');

// 특정 게시글 댓글 전체 가져오기
router.get('/:freeboardkey', showAll);

// 특정 게시글 댓글 생성
router.post('/create/:freeboardkey', verifyToken, asyncHandler(createComment));

// 특정 게시글 댓글 삭제
router.delete('/delete/:freeboardkey/:commentkey', verifyToken, asyncHandler(deleteComment));


module.exports = router;