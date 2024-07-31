// StudentSupportInfo 라우트코드
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../../middleware/token');
const { optionalVerifyToken } = require('../../../middleware/token');
const asyncHandler = require("express-async-handler");
const {
    showAllList,
    showDetailInfo,
    scrapStudentSupportInfo,
    deleteStudentSupportScrap,
    createInfoAdmin,
    deleteInfoAdmin,
    searchByTitle
} = require('../../../controllers/ITInfo/StudentSupportInfo/studentSupportInfoController');

// 모든 목록 가져오기 [학생지원] - GET /api/studentSupportInfo
router.get('/', showAllList);

// 정보글 상세 조회 [학생지원] - GET /api/studentSupportInfo/:key
router.get('/:key', optionalVerifyToken, showDetailInfo);

// 관심 학생지원 스크랩 - POST /api/studentSupportInfo/:studentSupportInfoKey/scrap
router.post('/:studentSupportInfoKey/scrap', verifyToken, scrapStudentSupportInfo);

// 스크랩 삭제 - DELETE /api/studentSupportInfo/:studentSupportInfoKey/scrap
router.delete('/:studentSupportInfoKey/scrap', verifyToken, deleteStudentSupportScrap);


// ⭐ 정보글 관리자가 직접 작성 [학생지원] - POST /api/studentSupportInfo/admin
router.post('/admin', createInfoAdmin);

// ⭐ 정보글 관리자가 직접 삭제 [학생지원] - DELETE /api/studentSupportInfo/admin/delete/:key
router.delete('/admin/delete/:key', deleteInfoAdmin);

// 제목으로 게시글 검색
router.post('/search', asyncHandler(searchByTitle)); // 새로운 라우트 추가

module.exports = router;