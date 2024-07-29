// RecruitmentNoticeInfo 라우트코드
const express = require('express');
const router = express.Router();
const {verifyToken} = require('../../../middleware/token');
const asyncHandler = require("express-async-handler");
const {
    showAllList,
    showDetailInfo,
    scrapRecruitNoticeInfo,
    deleteRecruitNoticeScrap,
    createInfoAdmin,
    deleteInfoAdmin,
    searchByTitle
} = require('../../../controllers/ITInfo/RecruitmentNoticeInfo/recruitmentNoticeInfoController');

// 모든 목록 가져오기 [채용공고] - GET /api/recruitNoticeInfo
router.get('/', showAllList);

// 정보글 상세 조회 [채용공고] - GET /api/recruitNoticeInfo/:key
router.get('/:key', showDetailInfo);

// 관심 채용공고 스크랩 - POST /api/recruitNoticeInfo/:recruitNoticeInfoKey/scrap
router.post('/:recruitmentNoticeInfoKey/scrap', verifyToken, scrapRecruitNoticeInfo);

// 스크랩 삭제 - DELETE /api/recruitNoticeInfo/:recruitNoticeInfoKey/scrap
router.delete('/:recruitmentNoticeInfoKey/scrap', verifyToken, deleteRecruitNoticeScrap);

// ⭐ 정보글 관리자가 직접 작성 [채용공고] - POST /api/recruitNoticeInfo/admin
router.post('/admin', createInfoAdmin);

// ⭐ 정보글 관리자가 직접 삭제 [채용공고] - DELETE /api/recruitNoticeInfo/admin/delete/:key
router.delete('/admin/delete/:key', deleteInfoAdmin);

// 제목으로 게시글 검색
router.post('/search', asyncHandler(searchByTitle)); // 새로운 라우트 추가

module.exports = router;