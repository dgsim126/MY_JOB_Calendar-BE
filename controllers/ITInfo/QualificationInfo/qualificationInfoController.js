// QualificationInfo 컨트롤러
const asyncHandler = require("express-async-handler");
const QualificationInfo = require("../../../models/ITInfo/QualificationInfo/qualificationInfoModel");
const Scrap = require("../../../models/Scrap/scrap");
const { Sequelize } = require('sequelize');
const { Op } = require('sequelize');

/**
 * 모든 목록 가져오기 [자격증]
 * GET /api/qualificationInfo
 */
const showAllList = asyncHandler(async (req, res) => {
    try {
        const qualificationInfos = await QualificationInfo.findAll({
            attributes: [
                'key', // 기본 키 컬럼
                'title', 'body', 'agency', 'startdate', 'enddate', 'pic1',
                [Sequelize.fn('COUNT', Sequelize.col('Scraps.key')), 'scrapCount'] // 스크랩 수 계산
            ],
            include: [
                {
                    model: Scrap,
                    attributes: [] // 실제 데이터는 필요 없으므로 빈 배열
                }
            ],
            group: ['QualificationInfoModel.key'], // 기본 키 컬럼 기준 그룹화
            raw: true
        });
        res.status(200).json(qualificationInfos);
    } catch (error) {
        console.error('Error fetching qualification info:', error);
        res.status(500).send('Internal Server Error');
    }
});

/**
 * 정보글 상세 조회 [자격증]
 * GET /api/qualificationInfo/:key
 */
const showDetailInfo = asyncHandler(async (req, res) => {
    const { key } = req.params;
    
    try {
        const qualificationInfo = await QualificationInfo.findOne({
            where: { key },
            include: [{
                model: Scrap,
                attributes: [] // 실제 데이터는 필요 없으므로 빈 배열
            }],
            attributes: {
                // 모든 속성과 함께 스크랩 수를 포함
                include: [
                    [Sequelize.fn('COUNT', Sequelize.col('Scraps.key')), 'scrapCount']
                ]
            },
            group: ['QualificationInfoModel.key'] // 기본 키 컬럼 기준 그룹화
        });

        if (!qualificationInfo) {
            return res.status(404).json({ message: 'Qualification Info not found' });
        }
        res.status(200).json(qualificationInfo);
    } catch (error) {
        console.error('Error fetching qualification info:', error);
        res.status(500).send('Internal Server Error');
    }
});

/**
 * POST /api/qualificationInfo/:qualificationInfoKey/scrap
 * 관심 자격증 스크랩
 */
const scrapQualificationInfo = asyncHandler(async (req, res) => {
    const userID = req.user.userID; // 로그인된 유저 ID 가져오기
    const { qualificationInfoKey } = req.params;

    // 스크랩 중복 체크
    const existingScrap = await Scrap.findOne({
        where: {
            userID,
            qualificationInfoKey
        }
    });
    if (existingScrap) {
        return res.status(400).json({ message: 'Already scrapped this qualification info' });
    }

    // 스크랩 생성
    await Scrap.create({
        userID,
        qualificationInfoKey
    });

    res.status(201).json({ message: 'Qualification info scrapped successfully' });
});

/**
 * DELETE /api/qualificationInfo/:qualificationInfoKey/scrap
 * 스크랩 삭제
 */
const deleteQualificationScrap = asyncHandler(async (req, res) => {
    const { qualificationInfoKey } = req.params;
    const userID = req.user.userID;

    const scrap = await Scrap.findOne({
        where: {
            qualificationInfoKey,
            userID
        }
    });

    if (!scrap) {
        return res.status(404).send('Scrap not found');
    }

    await scrap.destroy();
    res.status(200).send('Scrap deleted successfully');
});

/**
 * ⭐ 정보글 관리자가 직접 작성 [자격증]
 * POST /api/qualificationInfo/admin
 */
const createInfoAdmin = asyncHandler(async (req, res) => {
    const {
        title,
        startdate,
        enddate,
        exam_startdate,
        exam_enddate,
        resultdate,
        logo,
        pic1,
        pic2,
        pic3,
        pic4,
        pic5,
        body,
        pass_standard,
        workview,
        qualification,
        testinfo,
        problems,
        qualification_name,
        relate_department,
        agency,
        link,
        fee
    } = req.body;

    try {
        const newQualificationInfo = await QualificationInfo.create({
            title,
            startdate,
            enddate,
            exam_startdate,
            exam_enddate,
            resultdate,
            logo,
            pic1,
            pic2,
            pic3,
            pic4,
            pic5,
            body,
            pass_standard,
            workview,
            qualification,
            testinfo,
            problems,
            qualification_name,
            relate_department,
            agency,
            link,
            fee
        });

        res.status(201).json(newQualificationInfo);
    } catch (error) {
        console.error('Error creating new qualification info:', error);
        res.status(500).send('Internal Server Error');
    }
});

/**
 * ⭐ 정보글 관리자가 직접 삭제 [자격증]
 * POST /api/qualificationInfo/admin/delete/:key
 */
const deleteInfoAdmin = asyncHandler(async (req, res) => {
    const { key } = req.params;

    const deleteInfo = await QualificationInfo.findByPk(key);
    if (!deleteInfo) {
        return res.status(404).json({ message: 'Info not found' });
    }

    // 관련 스크랩 삭제
    await Scrap.destroy({ where: { qualificationInfoKey: key } });
    await deleteInfo.destroy();
    
    res.status(204).send();
});

/**
 * 제목으로 게시글 검색
 * POST /api/qualificationInfo/search
 */
const searchByTitle = asyncHandler(async (req, res) => {
    const { title } = req.body; // 요청 본문에서 제목을 가져옴

    if (!title) {
        return res.status(400).json({ message: "검색어가 필요합니다." });
    }

    try {
        const posts = await QualificationInfo.findAll({
            where: {
                title: {
                    [Op.like]: `%${title}%` // 제목에 검색어가 포함된 게시글 찾기
                }
            }
        });

        if (posts.length === 0) {
            return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
        }

        res.status(200).json(posts);
    } catch (error) {
        console.error('Error searching posts by title:', error);
        res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
});

module.exports = { showAllList, showDetailInfo, scrapQualificationInfo,
    deleteQualificationScrap, createInfoAdmin, deleteInfoAdmin, searchByTitle };