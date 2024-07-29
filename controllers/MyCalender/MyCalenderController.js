const asyncHandler = require("express-async-handler");
const QualificationInfo = require("../../models/ITInfo/QualificationInfo/qualificationInfoModel");
const RecruitmentNoticeInfo = require("../../models/ITInfo/RecruitmentNoticeInfo/recruitmentNoticeInfoModel");
const StudentSupportInfo = require("../../models/ITInfo/StudentSupportInfo/studentSupportInfoModel");
const Scrap = require("../../models/Scrap/scrap"); // Scrap 모델 추가
const { addEvent } = require('../google/calendarController'); // 경로를 실제 경로로 수정


/**
 * 모든 게시글 가져오기
 * GET /api/my
 */
const showAll = asyncHandler(async (req, res) => {
    console.log("check");
    try {
        const userID = req.user.userID;
        console.log(userID);

        // Scrap 테이블에서 해당 userID를 가지고 있는 모든 튜플을 불러옴
        const scraps = await Scrap.findAll({ where: { userID } });

        // 각 Scrap에 대한 데이터를 가져올 배열
        let combinedData = [];

        for (const scrap of scraps) {
            const { studentSupportInfoKey, qualificationInfoKey, recruitmentNoticeInfoKey } = scrap;

            // StudentSupportInfo 정보 가져오기
            if (studentSupportInfoKey) {
                const studentSupportInfo = await StudentSupportInfo.findOne({
                    where: { key: studentSupportInfoKey },
                    attributes: ['key', 'title', 'startdate', 'enddate']
                });
                if (studentSupportInfo) {
                    combinedData.push({
                        ...studentSupportInfo.toJSON(),
                        whatis: 'studentSupport'
                    });
                }
            }

            // QualificationInfo 정보 가져오기
            if (qualificationInfoKey) {
                const qualificationInfo = await QualificationInfo.findOne({
                    where: { key: qualificationInfoKey },
                    attributes: ['key', 'title', 'startdate', 'enddate']
                });
                if (qualificationInfo) {
                    combinedData.push({
                        ...qualificationInfo.toJSON(),
                        whatis: 'qualification'
                    });
                }
            }

            // RecruitmentNoticeInfo 정보 가져오기
            if (recruitmentNoticeInfoKey) {
                const recruitmentNoticeInfo = await RecruitmentNoticeInfo.findOne({
                    where: { key: recruitmentNoticeInfoKey },
                    attributes: ['key', 'title', 'startdate', 'enddate']
                });
                if (recruitmentNoticeInfo) {
                    combinedData.push({
                        ...recruitmentNoticeInfo.toJSON(),
                        whatis: 'recruitmentNotice'
                    });
                }
            }
        }

        res.status(200).json(combinedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
});

/**
 * 모든 게시글 가져오기 및 구글 캘린더에 추가
 * GET /api/my/google
 */
const google = asyncHandler(async (req, res) => {

    console.log("Starting google function");

    try {
        const userID = req.user.userID;

        console.log(`Fetching scraps for userID: ${userID}`);

        // Scrap 테이블에서 해당 userID를 가지고 있는 모든 튜플을 불러옴
        const scraps = await Scrap.findAll({ where: { userID } });
        console.log(`Found ${scraps.length} scraps`);

        // 각 Scrap에 대한 데이터를 가져올 배열
        let combinedData = [];

        for (const scrap of scraps) {
            const { studentSupportInfoKey, qualificationInfoKey, recruitmentNoticeInfoKey } = scrap;

            console.log(`Processing scrap with keys: ${studentSupportInfoKey}, ${qualificationInfoKey}, ${recruitmentNoticeInfoKey}`);

            // StudentSupportInfo 정보 가져오기
            if (studentSupportInfoKey) {
                const studentSupportInfo = await StudentSupportInfo.findOne({
                    where: { key: studentSupportInfoKey },
                    attributes: ['key', 'title', 'startdate', 'enddate']
                });
                if (studentSupportInfo) {
                    console.log(`Found StudentSupportInfo: ${studentSupportInfo.title}`);
                    combinedData.push({
                        ...studentSupportInfo.toJSON(),
                        whatis: 'studentSupport'
                    });
                } else {
                    console.log(`No StudentSupportInfo found for key: ${studentSupportInfoKey}`);
                }
            }

            // QualificationInfo 정보 가져오기
            if (qualificationInfoKey) {
                const qualificationInfo = await QualificationInfo.findOne({
                    where: { key: qualificationInfoKey },
                    attributes: ['key', 'title', 'startdate', 'enddate']
                });
                if (qualificationInfo) {
                    console.log(`Found QualificationInfo: ${qualificationInfo.title}`);
                    combinedData.push({
                        ...qualificationInfo.toJSON(),
                        whatis: 'qualification'
                    });
                } else {
                    console.log(`No QualificationInfo found for key: ${qualificationInfoKey}`);
                }
            }

            // RecruitmentNoticeInfo 정보 가져오기
            if (recruitmentNoticeInfoKey) {
                const recruitmentNoticeInfo = await RecruitmentNoticeInfo.findOne({
                    where: { key: recruitmentNoticeInfoKey },
                    attributes: ['key', 'title', 'startdate', 'enddate']
                });
                if (recruitmentNoticeInfo) {
                    console.log(`Found RecruitmentNoticeInfo: ${recruitmentNoticeInfo.title}`);
                    combinedData.push({
                        ...recruitmentNoticeInfo.toJSON(),
                        whatis: 'recruitmentNotice'
                    });
                } else {
                    console.log(`No RecruitmentNoticeInfo found for key: ${recruitmentNoticeInfoKey}`);
                }
            }
        }

        console.log(`Combined data to send to Google Calendar: ${JSON.stringify(combinedData, null, 2)}`);

        // combinedData의 각 이벤트를 구글 캘린더에 추가
        for (const event of combinedData) {
            console.log(`Adding event to Google Calendar: ${JSON.stringify(event, null, 2)}`);
            try {
                await addEvent({
                    title: event.title,
                    startdate: event.startdate,
                    enddate: event.enddate
                });
                console.log(`Event added: ${event.title}`);
            } catch (error) {
                console.error('Error adding event:', error);
            }
        }

        // 클라이언트에게 응답을 보내기
        res.status(200).json({ message: "Events processed and added to Google Calendar." });
    } catch (error) {
        console.error('Error in google function:', error);
        res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
});

module.exports = { showAll, google };
