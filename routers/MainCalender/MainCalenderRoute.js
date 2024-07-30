const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { optionalVerifyToken } = require('../../middleware/token');
const { showAll } = require('../../controllers/MainCalender/MainCalenderController');

// 모든 게시글 가져오기
router.get('/', optionalVerifyToken, asyncHandler(showAll));

module.exports = router;