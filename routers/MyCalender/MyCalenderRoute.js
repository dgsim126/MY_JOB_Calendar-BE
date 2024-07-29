const express = require('express');
const router = express.Router();
const asyncHandler = require("express-async-handler");
const {verifyToken} = require('../../middleware/token');
const { showAll, google } = require('../../controllers/MyCalender/MyCalenderController');

// 모든 게시글 가져오기
router.get('/', verifyToken, asyncHandler(showAll));

router.get('/google', verifyToken, asyncHandler(google));

module.exports = router;