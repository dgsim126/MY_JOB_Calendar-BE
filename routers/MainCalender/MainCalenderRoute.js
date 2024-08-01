const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { optionalVerifyToken } = require('../../middleware/token');
const { showAll, showPopular } = require('../../controllers/MainCalender/MainCalenderController');

// 모든 게시글 가져오기
router.get('/', optionalVerifyToken, asyncHandler(showAll));

// 인기 상위 9개 보내기
router.get('/show', asyncHandler(showPopular));

module.exports = router;