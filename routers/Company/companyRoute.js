const express = require('express');
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { getCompanies, getCompanyById, scrapCompany, deleteScrap, createCompany, deleteCompany, searchByCompanyName } = require('../../controllers/Company/companyController');
const {verifyToken} = require('../../middleware/token');

// GET api/company
router.get('/', getCompanies);

// GET api/company/:companyID
router.get('/:companyID', getCompanyById)

// POST /api/company/:companyID/scrap
router.post('/:companyID/scrap', verifyToken, scrapCompany);

// DELETE api/company/:companyID/scrap
router.delete('/:companyID/scrap', verifyToken, deleteScrap);

// POST api/company/admin
router.post('/admin', createCompany);

// DELETE api/company/admin/:companyID
router.delete('/admin/:companyID', deleteCompany);

// companyName
// 제목으로 게시글 검색
router.post('/search', asyncHandler(searchByCompanyName)); // 새로운 라우트 추가

module.exports = router;