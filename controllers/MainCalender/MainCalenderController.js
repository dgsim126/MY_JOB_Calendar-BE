const asyncHandler = require("express-async-handler");
const QualificationInfo = require("../../models/ITInfo/QualificationInfo/qualificationInfoModel");
const RecruitmentNoticeInfo = require("../../models/ITInfo/RecruitmentNoticeInfo/recruitmentNoticeInfoModel");
const StudentSupportInfo = require("../../models/ITInfo/StudentSupportInfo/studentSupportInfoModel");
const Scrap = require('../../models/Scrap/scrap'); // 스크랩 테이블
const User = require('../../models/User/user'); // User 모델

/**
 * 인기 상위 9개 보여주기
 * GET /api/main/show
 */
const showPopular = asyncHandler(async (req, res) => {
    try {
        // QualificationInfo에서 key값이 1, 3, 5인 튜플을 다 가져옴
        const qualificationData = await QualificationInfo.findAll({
            where: {
                key: [1, 3, 5]
            },
            attributes: ['key', 'title', 'startdate', 'enddate']
        });

        // QualificationInfo 데이터에 'whatis' 속성을 추가
        const modifiedQualificationData = qualificationData.map(qualification => ({
            ...qualification.toJSON(),
            whatis: 'qualification'
        }));

        // RecruitmentNoticeInfo에서 key값이 1, 3, 5인 튜플을 다 가져옴
        const recruitmentNoticeData = await RecruitmentNoticeInfo.findAll({
            where: {
                key: [1, 3, 5]
            },
            attributes: ['key', 'title', 'startdate', 'enddate']
        });

        // RecruitmentNoticeInfo 데이터에 'whatis' 속성을 추가
        const modifiedRecruitmentNoticeData = recruitmentNoticeData.map(recruitmentNotice => ({
            ...recruitmentNotice.toJSON(),
            whatis: 'recruitmentNotice'
        }));

        // StudentSupportInfo에서 key값이 2, 4, 6인 튜플을 다 가져옴
        const studentSupportData = await StudentSupportInfo.findAll({
            where: {
                key: [2, 4, 5]
            },
            attributes: ['key', 'title', 'startdate', 'enddate']
        });

        // StudentSupportInfo 데이터에 'whatis' 속성을 추가
        const modifiedStudentSupportData = studentSupportData.map(studentSupport => ({
            ...studentSupport.toJSON(),
            whatis: 'studentSupport'
        }));

        // 총 9개의 튜플을 묶어서 보냄
        const combinedData = [
            ...modifiedQualificationData,
            ...modifiedRecruitmentNoticeData,
            ...modifiedStudentSupportData
        ];

        res.status(200).json(combinedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
});

/**
 * 모든 게시글 가져오기
 * GET /api/main
 */
const showAll = asyncHandler(async (req, res) => {
    try {
        // QualificationInfo 정보 전달----------------------------------------------------
        const qualificationData = await QualificationInfo.findAll({
            attributes: ['key', 'title', 'startdate', 'enddate']
        });

        // QualificationInfo 데이터에 'whatis' 속성을 추가
        const modifiedQualificationData = qualificationData.map(qualification => ({
            ...qualification.toJSON(), // Sequelize 객체를 JSON 객체로 변환
            whatis: 'qualification'
        }));

        // RecruitmentNoticeInfo 정보 전달-------------------------------------------------
        const recruitmentNoticeData = await RecruitmentNoticeInfo.findAll({
            attributes: ['key', 'title', 'startdate', 'enddate']
        });

        // RecruitmentNoticeInfo 데이터에 'whatis' 속성을 추가
        const modifiedRecruitmentNoticeData = recruitmentNoticeData.map(recruitmentNotice => ({
            ...recruitmentNotice.toJSON(),
            whatis: 'recruitmentNotice'
        }));

        // StudentSupportInfo 정보 전달----------------------------------------------------
        const studentSupportData = await StudentSupportInfo.findAll({
            attributes: ['key', 'title', 'startdate', 'enddate']
        });

        // StudentSupportInfo 데이터에 'whatis' 속성을 추가
        const modifiedStudentSupportData = studentSupportData.map(studentSupport => ({
            ...studentSupport.toJSON(),
            whatis: 'studentSupport'
        }));

        // 모든 데이터 결합
        let combinedData = [
            ...modifiedQualificationData,
            ...modifiedRecruitmentNoticeData,
            ...modifiedStudentSupportData
        ];

        // 로그인한 사용자의 스크랩 정보 가져오기
        if (req.user) {
            const userId = req.user.userID;
            const user = await User.findByPk(userId, {
                attributes: [],
                include: [{
                    model: Scrap,
                    attributes: ['studentSupportInfoKey', 'qualificationInfoKey', 'recruitmentNoticeInfoKey']
                }]
            });

         // user가 null이 아닌지 확인
         if (user && user.Scraps) {
            const userScraps = user.Scraps;

            console.log("User Scraps:", userScraps);

            combinedData = combinedData.map(event => {
                if (event.whatis === 'qualification') {
                    event.isScrapped = userScraps.some(scrap => scrap.qualificationInfoKey === event.key);
                } else if (event.whatis === 'recruitmentNotice') {
                    event.isScrapped = userScraps.some(scrap => scrap.recruitmentNoticeInfoKey === event.key);
                } else if (event.whatis === 'studentSupport') {
                    event.isScrapped = userScraps.some(scrap => scrap.studentSupportInfoKey === event.key);
                }
                return event;
            });
        }
    }

        res.status(200).json(combinedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
});
module.exports = { showAll, showPopular };
