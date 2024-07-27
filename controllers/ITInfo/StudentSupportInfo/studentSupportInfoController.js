// StudentSupportInfo 컨트롤러
const asyncHandler = require("express-async-handler");
const StudentSupportInfo = require("../../../models/ITInfo/StudentSupportInfo/studentSupportInfoModel");
const Scrap = require("../../../models/Scrap/scrap");
const { Sequelize } = require('sequelize');

/**
 * 모든 목록 가져오기 [학생지원]
 * GET /api/studentSupportInfo
 */
const showAllList = asyncHandler(async (req, res) => {
    try {
        const studentSupportInfos = await StudentSupportInfo.findAll({
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
            group: ['StudentSupportInfoModel.key'], // 기본 키 컬럼 기준 그룹화
            raw: true
        });
        res.status(200).json(studentSupportInfos);
    } catch (error) {
        console.error('Error fetching student support info:', error);
        res.status(500).send('Internal Server Error');
    }
});

/**
 * 정보글 상세 조회 [학생지원]
 * GET /api/studentSupportInfo/:key
 */
const showDetailInfo = asyncHandler(async (req, res) => {
    const { key } = req.params;
    
    try {
        const studentSupportInfo = await StudentSupportInfo.findOne({
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
            group: ['StudentSupportInfoModel.key'] // 기본 키 컬럼 기준 그룹화
        });

        if (!studentSupportInfo) {
            return res.status(404).json({ message: 'Student Support Info not found' });
        }
        res.status(200).json(studentSupportInfo);
    } catch (error) {
        console.error('Error fetching student support info:', error);
        res.status(500).send('Internal Server Error');
    }
});

// POST /api/studentSupportInfo/:studentSupportInfoKey/scrap
// 관심 학생지원 스크랩
const scrapStudentSupportInfo = asyncHandler(async (req, res) => {
    const userID = req.user.userID; // 로그인된 유저 ID 가져오기
    const { studentSupportInfoKey } = req.params;

    // 스크랩 중복 체크
    const existingScrap = await Scrap.findOne({
        where: {
            userID,
            studentSupportInfoKey
        }
    });
    if (existingScrap) {
        return res.status(400).json({ message: 'Already scrapped this student support info' });
    }

    // 스크랩 생성
    await Scrap.create({
        userID,
        studentSupportInfoKey
    });

    res.status(201).json({ message: 'Student support info scrapped successfully' });
});

// DELETE /api/studentSupportInfo/:studentSupportInfoKey/scrap
// 스크랩 삭제
const deleteStudentSupportScrap = asyncHandler(async (req, res) => {
    const { studentSupportInfoKey } = req.params;
    const userID = req.user.userID;

    const scrap = await Scrap.findOne({
        where: {
            studentSupportInfoKey,
            userID
        }
    });
    console.log(scrap);

    if (!scrap) {
        return res.status(404).send('Scrap not found');
    }

    await scrap.destroy();
    res.status(200).send('Scrap deleted successfully');
});


/**
 * ⭐ 정보글 관리자가 직접 작성 [학생지원]
 * POST /api/studentSupportInfo/admin
 */
const createInfoAdmin = asyncHandler(async (req, res) => {
    const {
        title,
        startdate,
        enddate,
        resultdate,
        logo,
        pic1,
        pic2,
        pic3,
        pic4,
        pic5,
        body,
        support_target,
        application_method,
        qualification,
        support_detail,
        link,
        agency
    } = req.body;

    try {
        const newStudentSupportInfo = await StudentSupportInfo.create({
            title,
            startdate,
            enddate,
            resultdate,
            logo,
            pic1,
            pic2,
            pic3,
            pic4,
            pic5,
            body,
            support_target,
            application_method,
            qualification,
            support_detail,
            link,
            agency
        });

        res.status(201).json(newStudentSupportInfo);
    } catch (error) {
        console.error('Error creating new student support info:', error);
        res.status(500).send('Internal Server Error');
    }
});

/**
 * ⭐ 정보글 관리자가 직접 삭제 [학생지원]
 * POST /api/studentSupportInfo/admin/delete/:key
 */
const deleteInfoAdmin = asyncHandler(async (req, res) => {
    const { key } = req.params;

    const deleteInfo = await StudentSupportInfo.findByPk(key);
    if (!deleteInfo) {
        return res.status(404).json({ message: 'Info not found' });
    }

    await Scrap.destroy({ where: { studentSupportInfoKey: key } }); // 나중에 추가
    await deleteInfo.destroy();
    
    res.status(204).send();
});

module.exports = { showAllList, showDetailInfo, scrapStudentSupportInfo,
    deleteStudentSupportScrap, createInfoAdmin, deleteInfoAdmin };