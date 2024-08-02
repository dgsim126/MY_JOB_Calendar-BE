require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const { sequelize } = require("./config/db");

const cors = require('cors'); // cors 추가


// 모델 초기화 및 관계 설정
const User = require('./models/User/user');
const Company = require('./models/Company/company');
const Scrap = require('./models/Scrap/scrap');
const StudentSupportInfo = require('./models/ITInfo/StudentSupportInfo/studentSupportInfoModel');
const QualificationInfo = require('./models/ITInfo/QualificationInfo/qualificationInfoModel');
const RecruitmentNoticeInfo = require('./models/ITInfo/RecruitmentNoticeInfo/recruitmentNoticeInfoModel');
const Freeboard = require('./models/FreeBoard/freeboard');
const FreeboardComment = require('./models/FreeBoard/freeboardComment');
const Studyboard = require('./models/StudyBoard/studyboard');
const StudyboardComment = require('./models/StudyBoard/studyboardComment');

// 모델 초기화 => 초기 한 번만 진행하면 테이블 갱신됨
User.init(sequelize);
Company.init(sequelize);
Scrap.init(sequelize);
StudentSupportInfo.init(sequelize);
QualificationInfo.init(sequelize);
RecruitmentNoticeInfo.init(sequelize);
Freeboard.init(sequelize);
FreeboardComment.init(sequelize);
Studyboard.init(sequelize);
StudyboardComment.init(sequelize);

// 모델 간의 관계 설정
User.associate({ Scrap });
Company.associate({ Scrap });
Scrap.associate({ User, Company, StudentSupportInfo, QualificationInfo, RecruitmentNoticeInfo });
StudentSupportInfo.associate({ Scrap });
QualificationInfo.associate({ Scrap });
RecruitmentNoticeInfo.associate({ Scrap });
Freeboard.associate({ FreeboardComment });
FreeboardComment.associate({ Freeboard });
Studyboard.associate({ StudyboardComment });
StudyboardComment.associate({ Studyboard });

const app = express();
const port = 8080;

app.use(cors({
    // origin: true, // 로컬 테스트용
    origin: 'https://myjobcalendar.duckdns.org', // 해당 도메인만 허용
    credentials: true // 쿠키를 포함한 요청을 허용
}));

// 데이터베이스 연결
sequelize
.sync({ force: false }) // 현재 모델 상태 반영(배포 시 false로 변환) // true 시 값 날라감
.then(() => {
    console.log('데이터베이스 연결 성공');
})
.catch(err => {
    console.log(err);
});

// EJS를 뷰 엔진으로 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 미들웨어 설정
//app.use(express.json());
//app.use(express.urlencoded({ extended: true })); // URL-encoded 데이터 파싱
app.use(express.json({ limit: '10mb' })); // !!!!!!! 수정 !!!!! 요청 본문 크기 제한 설정 (10MB)
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // !!!!!!! 수정 !!!!! URL-encoded 데이터 크기 제한 설정 (10MB)
app.use(cookieParser()); // 쿠키 파서 미들웨어 추가

// 회원가입, 로그인, 로그아웃, 프로필, 현재 로그인중인 사용자의 이름만 반환
app.use('/api/register', require('./routers/User/registerRoute'));
app.use('/api', require('./routers/User/loginRoute'));
app.use('/api/profile', require('./routers/User/profileRoute'));

// 기업 목록, 기업 상세, 관심기업 스크랩
app.use("/api/company", require('./routers/Company/companyRoute'));

// 자유게시판, 스터디모집게시판, 댓글
app.use("/api/freeboard", require("./routers/FreeBoard/freeboardRoute"));
app.use("/api/freeboardComment", require("./routers/FreeBoard/freeboardCommentRoute"));
app.use("/api/studyboard", require("./routers/StudyBoard/studyboardRoute"));
app.use("/api/studyboardComment", require("./routers/StudyBoard/studyboardCommentRoute"));

// 관리자
app.use("/api/admin/freeboard", require("./routers/admin/freeboardAdminRoute"));
app.use("/api/admin/studyboard", require("./routers/admin/studyboardAdminRoute"));

// IT Info [학생지원, 자격증, 채용공고]
app.use("/api/studentSupportInfo", require("./routers/ITInfo/StudentSupportInfo/studentSupportInfoRoute"));
app.use("/api/qualificationInfo", require("./routers/ITInfo/QualificationInfo/qualificationInfoRoute"));
app.use("/api/recruitmentNoticeInfo", require("./routers/ITInfo/RecruitmentNoticeInfo/recruitmentNoticeInfoRoute"));

// 메인 캘린더
app.use("/api/main", require("./routers/MainCalender/MainCalenderRoute"));
app.use("/api/my", require("./routers/MyCalender/MyCalenderRoute"));

// 인증 라우트 추가
app.use('/api/auth', require("./routers/google/authRoute"));

// 서버 시작
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});