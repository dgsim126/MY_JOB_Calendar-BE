const express = require('express');
const router = express.Router();
const asyncHandler = require("express-async-handler");
const {verifyToken} = require('../../middleware/token');
const { 
    showAll, 
    showDetail, 
    createPost,  
    updatePost, 
    deletePost,
    searchByTitle
} = require('../../controllers/FreeBoard/freeboardController');

// 모든 게시글 가져오기
router.get('/', asyncHandler(showAll));

// 게시글 상세 조회
router.get('/:key', asyncHandler(showDetail));

// 게시글 작성 내용을 DB에 넣기
router.post('/create', verifyToken, asyncHandler(createPost));

// 게시글 수정 내용을 DB에 넣기
router.put('/update/:key', verifyToken, asyncHandler(updatePost));

// 게시글 삭제
router.delete('/delete/:key', verifyToken, asyncHandler(deletePost));

// 제목으로 게시글 검색
router.post('/search', asyncHandler(searchByTitle)); // 새로운 라우트 추가

module.exports = router;
