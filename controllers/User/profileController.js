const asyncHandler = require("express-async-handler");
const { sequelize } = require("../../config/db");
const bcrypt = require("bcrypt");
const User = require('../../models/User/user');
const Freeboard = require('../../models/FreeBoard/freeboard');
const Studyboard = require('../../models/StudyBoard/studyboard');
const Company = require('../../models/Company/company');
const Scrap = require('../../models/Scrap/scrap');
const StudentSupportInfo = require('../../models/ITInfo/StudentSupportInfo/studentSupportInfoModel');
const QualificationInfo = require('../../models/ITInfo/QualificationInfo/qualificationInfoModel');
const RecruitmentNoticeInfo = require('../../models/ITInfo/RecruitmentNoticeInfo/recruitmentNoticeInfoModel');
const { Sequelize } = require("sequelize");

// GET /api/profile
const getProfile = asyncHandler(async (req, res) => {
    try {
        const id = req.user.userID;

        // 사용자 정보와 스크랩 수를 함께 가져옴
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] },
            include: [{
                model: Scrap,
                as: 'Scraps', // 명확한 별칭 설정
                attributes: [
                    'companyID', 
                    'studentSupportInfoKey', 
                    'qualificationInfoKey', 
                    'recruitmentNoticeInfoKey',
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM scrap AS s
                            WHERE s.companyID = Scraps.companyID
                        )`), 'companyScrapCount'
                    ],
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM scrap AS s
                            WHERE s.studentSupportInfoKey = Scraps.studentSupportInfoKey
                        )`), 'studentSupportScrapCount'
                    ],
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM scrap AS s
                            WHERE s.qualificationInfoKey = Scraps.qualificationInfoKey
                        )`), 'qualificationScrapCount'
                    ],
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM scrap AS s
                            WHERE s.recruitmentNoticeInfoKey = Scraps.recruitmentNoticeInfoKey
                        )`), 'recruitmentNoticeScrapCount'
                    ]
                ],
                include: [
                    {
                        model: Company,
                        attributes: ['companyName', 'establish', 'logo', 'track', 'stack']
                    },
                    {
                        model: StudentSupportInfo,
                        attributes: ['title', 'body', 'agency', 'startdate', 'enddate', 'pic1']
                    },
                    {
                        model: QualificationInfo,
                        attributes: ['title', 'body', 'agency', 'startdate', 'enddate', 'pic1']
                    },
                    {
                        model: RecruitmentNoticeInfo,
                        attributes: ['title', 'body', 'experience', 'education', 'stack', 'work_type', 'companyname', 'startdate', 'enddate', 'pic1', 'recruit_part']
                    }
                ]
            }],
            group: ['User.userID', 'Scraps.key'] // 각 사용자의 스크랩을 그룹화
        });

        if (!user) {
            return res.status(404).send('User not found');
        }

        const email = user.email;

        const freeboardPosts = await Freeboard.findAll({
            where: { id: email }
        });

        const studyboardPosts = await Studyboard.findAll({
            where: { id: email }
        });

        res.status(200).json({
            user,
            freeboardPosts,
            studyboardPosts
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// GET /api/profile/name
const getUserName = asyncHandler(async (req, res) => {
    try {
        const id = req.user.userID;
        const user = await User.findByPk(id);
        if (user) {
            res.status(200).json({ name: user.name });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'server error' });
    }
});

// PUT /api/profile/edit
const updateProfile = asyncHandler(async (req, res) => {
    try {
        const id = req.user.userID;  // 모델의 primary key 필드명 사용
        const { name, password, birth, gender, job } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).send('User not found');
        }

        if (name) user.name = name;
        if (birth) user.birth = birth;
        if (gender) user.gender = gender;
        if (job) user.job = job;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }
        
        await user.save();
        res.status(200).send('Edit Success');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// DELETE /api/profile
const deleteProfile = asyncHandler(async (req, res) => {
    try {
        const id = req.user.userID;  // 모델의 primary key 필드명 사용
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        
        await user.destroy();
        res.status(200).send('Delete Success');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = { getProfile, updateProfile, deleteProfile, getUserName };
