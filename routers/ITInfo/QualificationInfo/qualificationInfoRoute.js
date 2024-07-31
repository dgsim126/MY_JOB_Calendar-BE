const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../../middleware/token');
const { optionalVerifyToken } = require('../../../middleware/token');
const asyncHandler = require("express-async-handler");
const {
    showAllList,
    showDetailInfo,
    scrapQualificationInfo,
    deleteQualificationScrap,
    createInfoAdmin,
    deleteInfoAdmin,
    searchByTitle
} = require('../../../controllers/ITInfo/QualificationInfo/qualificationInfoController');

// 모든 목록 가져오기 [자격증] - GET /api/qualificationInfo
router.get('/', showAllList);

// 정보글 상세 조회 [자격증] - GET /api/qualificationInfo/:key
router.get('/:key', optionalVerifyToken, showDetailInfo);

// 관심 자격증 스크랩 - POST /api/qualificationInfo/:qualificationInfoKey/scrap
router.post('/:qualificationInfoKey/scrap', verifyToken, scrapQualificationInfo);

// 스크랩 삭제 - DELETE /api/qualificationInfo/:qualificationInfoKey/scrap
router.delete('/:qualificationInfoKey/scrap', verifyToken, deleteQualificationScrap);

// ⭐ 정보글 관리자가 직접 작성 [자격증] - POST /api/qualificationInfo/admin
router.post('/admin', createInfoAdmin);

// ⭐ 정보글 관리자가 직접 삭제 [자격증] - DELETE /api/qualificationInfo/admin/delete/:key
router.delete('/admin/delete/:key', deleteInfoAdmin);

// 제목으로 게시글 검색
router.post('/search', asyncHandler(searchByTitle)); // 새로운 라우트 추가

module.exports = router;