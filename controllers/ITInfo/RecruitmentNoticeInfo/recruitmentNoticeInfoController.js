// RecruitmentNoticeInfo 컨트롤러
const asyncHandler = require("express-async-handler");
const RecruitmentNoticeInfo = require("../../../models/ITInfo/RecruitmentNoticeInfo/recruitmentNoticeInfoModel");
const Company= require("../../../models/Company/company");
const Scrap = require("../../../models/Scrap/scrap");
const { Sequelize } = require('sequelize');
const { Op } = require('sequelize');

/**
 * 모든 목록 가져오기 [채용공고]
 * GET /api/recruitmentNoticeInfo
 */
const showAllList = asyncHandler(async (req, res) => {
    try {
        const recruitmentNoticeInfos = await RecruitmentNoticeInfo.findAll({
            attributes: [
                'key', // 기본 키 컬럼이 'key'
                'title', 'body', 'experience', 'education', 'stack',
                'work_type', 'companyname', 'startdate', 'enddate', 'pic1', 'recruit_part',
                [Sequelize.fn('COUNT', Sequelize.col('Scraps.key')), 'scrapCount'] // 스크랩 수 계산
            ],
            include: [
                {
                    model: Scrap,
                    attributes: []
                }
            ],
            group: ['RecruitmentNoticeInfoModel.key'], // 기본 키 컬럼 기준 그룹화
            raw: true
        });
        res.status(200).json(recruitmentNoticeInfos);
    } catch (error) {
        console.error('Error fetching recruitment notice info:', error);
        res.status(500).send('Internal Server Error');
    }
});

// // --------------------------------------------------------------------------------------------------------
// /**
//  * 정보글 상세 조회 [채용공고]
//  * GET /api/recruitmentNoticeInfo/:key
//  */
// const showDetailInfo = asyncHandler(async (req, res) => {
//     const { key } = req.params;

//     try {
//         // 채용 공고 정보와 스크랩 수를 포함하여 조회
//         const recruitmentNoticeInfo = await RecruitmentNoticeInfo.findOne({
//             where: { key },
//             include: [{
//                 model: Scrap,
//                 attributes: [] // 실제 데이터는 필요 없으므로 빈 배열
//             }],
//             attributes: {
//                 // 모든 속성과 함께 스크랩 수를 포함
//                 include: [
//                     [Sequelize.fn('COUNT', Sequelize.col('Scraps.key')), 'scrapCount']
//                 ]
//             },
//             group: ['RecruitmentNoticeInfoModel.key'] // 기본 키 컬럼 기준 그룹화
//         });
//         if (!recruitmentNoticeInfo) {
//             return res.status(404).json({ message: 'Recruitment Notice Info not found' });
//         }

//         // companyName을 이용해 Company 모델에서 일치하는 튜플을 찾음
//         const company = await Company.findOne({
//             where: { companyName: recruitmentNoticeInfo.companyname }
//         });

//         // 두 개의 객체를 하나의 객체로 합쳐서 응답
//         res.status(200).json({ recruitmentNoticeInfo, company });
//     } catch (error) {
//         console.error('Error fetching recruitment notice info:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });
// --------------------------------------------------------------------------------------------------------

/**
 * 정보글 상세 조회 [채용공고]
 * GET /api/recruitmentNoticeInfo/:key
 */
const showDetailInfo = asyncHandler(async (req, res) => {
    const { key } = req.params;

    try {
        // 채용 공고 정보와 스크랩 수를 포함하여 조회
        const recruitmentNoticeInfo = await RecruitmentNoticeInfo.findOne({
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
            group: ['RecruitmentNoticeInfoModel.key'] // 기본 키 컬럼 기준 그룹화
        });

        if (!recruitmentNoticeInfo) {
            return res.status(404).json({ message: 'Recruitment Notice Info not found' });
        }

        // companyName을 이용해 Company 모델에서 일치하는 튜플을 찾음
        const company = await Company.findOne({
            where: { companyName: recruitmentNoticeInfo.companyname }
        });

        // stack 필드를 배열로 변환
        const stackArray = recruitmentNoticeInfo.stack.split(',').map(item => item.trim());

        // 각 stack 항목을 기준으로 다른 채용 공고를 조회
        const relatedNotices = await Promise.all(stackArray.map(async (stackItem) => {
            return await RecruitmentNoticeInfo.findAll({
                where: {
                    stack: {
                        [Op.like]: `%${stackItem}%`
                    }
                }
            });
        }));

        // 2차원 배열을 1차원 배열로 변환하고 중복 제거
        const uniqueNotices = [...new Set(relatedNotices.flat().map(notice => notice.key))];

        // 중복 제거된 공고들을 조회하여 상세 정보를 가져옴
        const detailedNotices = await Promise.all(uniqueNotices.map(async (noticeKey) => {
            return await RecruitmentNoticeInfo.findOne({
                where: { key: noticeKey },
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
                group: ['RecruitmentNoticeInfoModel.key']
            });
        }));

        // res.status(200).json({
        //     recruitmentNoticeInfo,
        //     company,
        //     relatedNotices: detailedNotices
        // });

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // 🌟[로직추가] - 동일한 companyName을 가진 다른 채용 공고 리스트 조회
        const otherRecruitmentNotices = await RecruitmentNoticeInfo.findAll({
            where: {
                companyName: recruitmentNoticeInfo.companyname, // companyName, name 유의할 것.
                key: {
                    [Sequelize.Op.ne]: key // 현재 조회된 공고는 제외
                }
            },
            attributes: [
                'key', // 기본 키 컬럼이 'key'
                'title', 'body', 'experience', 'education', 'stack',
                'work_type', 'companyname', 'startdate', 'enddate', 'pic1', 'recruit_part',
                [Sequelize.fn('COUNT', Sequelize.col('Scraps.key')), 'scrapCount'] // 스크랩 수 계산
            ],
            include: [
                {
                    model: Scrap,
                    attributes: []
                }
            ],
            group: ['RecruitmentNoticeInfoModel.key'], // 기본 키 컬럼 기준 그룹화
            raw: true
        });


        // // 세 개의 객체를 하나의 객체로 합쳐서 응답 + 동일회사 다른 글 정보 추가
        // res.status(200).json({ recruitmentNoticeInfo, company, otherRecruitmentNotices  });
        res.status(200).json({
            recruitmentNoticeInfo,
            company,
            otherRecruitmentNotices,
            relatedNotices: detailedNotices
        });
    } catch (error) {
        console.error('Error fetching recruitment notice info:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


/**
 * 관심 채용공고 스크랩
 * POST /api/recruitmentNoticeInfo/:recruitmentNoticeInfoKey/scrap
 */
const scrapRecruitNoticeInfo = asyncHandler(async (req, res) => {
    const userID = req.user.userID; // 로그인된 유저 ID 가져오기
    const { recruitmentNoticeInfoKey } = req.params;

    try {
        // 스크랩 중복 체크
        const existingScrap = await Scrap.findOne({
            where: {
                userID,
                recruitmentNoticeInfoKey
            }
        });

        if (existingScrap) {
            return res.status(400).json({ message: 'Already scrapped this recruit notice info' });
        }

        // 스크랩 생성
        await Scrap.create({
            userID,
            recruitmentNoticeInfoKey
        });

        res.status(201).json({ message: 'Recruit notice info scrapped successfully' });
    } catch (error) {
        console.error('Error in scrapRecruitNoticeInfo:', error);
        res.status(500).send('Internal Server Error');
    }
});

/**
 * 스크랩 삭제
 * DELETE /api/recruitmentNoticeInfo/:recruitmentNoticeInfoKey/scrap
 */
const deleteRecruitNoticeScrap = asyncHandler(async (req, res) => {
    const { recruitmentNoticeInfoKey } = req.params;
    const userID = req.user.userID;

    try {
        const scrap = await Scrap.findOne({
            where: {
                recruitmentNoticeInfoKey,
                userID
            }
        });

        if (!scrap) {
            return res.status(404).send('Scrap not found');
        }

        await scrap.destroy();
        res.status(200).send('Scrap deleted successfully');
    } catch (error) {
        console.error('Error in deleteRecruitNoticeScrap:', error);
        res.status(500).send('Internal Server Error');
    }
});

/**
 * ⭐ 정보글 관리자가 직접 작성 [채용공고]
 * POST /api/recruitmentNoticeInfo/admin
 */
const createInfoAdmin = asyncHandler(async (req, res) => {
    const {
        title,
        startdate,
        enddate,
        resultdate,
        pic1,
        pic2,
        pic3,
        pic4,
        pic5,
        body,
        experience,
        education,
        stack,
        qualification,
        preferences,
        work_type,
        salary,
        location,
        work_time,
        recruit_part,
        duties,
        key_skills,
        recruit_num,
        link,
        companyname
    } = req.body;

    try {
        const newRecruitmentNoticeInfo = await RecruitmentNoticeInfo.create({
            title,
            startdate,
            enddate,
            resultdate,
            pic1,
            pic2,
            pic3,
            pic4,
            pic5,
            body,
            experience,
            education,
            stack,
            qualification,
            preferences,
            work_type,
            salary,
            location,
            work_time,
            recruit_part,
            duties,
            key_skills,
            recruit_num,
            link,
            companyname
        });

        res.status(201).json(newRecruitmentNoticeInfo);
    } catch (error) {
        console.error('Error creating new recruitment notice info:', error);
        res.status(500).send('Internal Server Error');
    }
});



/**
 * ⭐ 정보글 관리자가 직접 삭제 [채용공고]
 * DELETE /api/recruitNoticeInfo/admin/delete/:key
 */
const deleteInfoAdmin = asyncHandler(async (req, res) => {
    const { key } = req.params;

    const deleteInfo = await RecruitmentNoticeInfo.findByPk(key);
    if (!deleteInfo) {
        return res.status(404).json({ message: 'Info not found' });
    }

    // 관련된 스크랩 정보도 삭제
    await Scrap.destroy({ where: { recruitmentNoticeInfoKey: key } });
    await deleteInfo.destroy();
    
    res.status(204).send();
});

/**
 * 제목으로 게시글 검색
 * POST /api/recruitNoticeInfo/search
 */
const searchByTitle = asyncHandler(async (req, res) => {
    const { title } = req.body; // 요청 본문에서 제목을 가져옴

    if (!title) {
        return res.status(400).json({ message: "검색어가 필요합니다." });
    }

    try {
        const posts = await RecruitmentNoticeInfo.findAll({
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



module.exports = { showAllList, showDetailInfo, scrapRecruitNoticeInfo,
    deleteRecruitNoticeScrap, createInfoAdmin, deleteInfoAdmin,  searchByTitle};