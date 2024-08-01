const { sequelize } = require('../config/db');
const StudentSupportInfo = require('../models/ITInfo/StudentSupportInfo/studentSupportInfoModel');

const studentSupports = [
{
    "title": "2024 학생지원 프로그램1",
    "startdate": "2024-08-01T00:00:00.000Z",
    "enddate": "2024-12-31T23:59:59.000Z",
    "resultdate": "2025-01-15T00:00:00.000Z",
    "logo": "logo.png",
    "pic1": "pic1.jpg",
    "pic2": "pic2.jpg",
    "pic3": "pic3.jpg",
    "pic4": "pic4.jpg",
    "pic5": "pic5.jpg",
    "body": "이 프로그램은 학생들의 다양한 활동을 지원하기 위해 마련되었습니다.",
    "support_target": "모든 학부생",
    "application_method": "온라인 신청",
    "qualification": "재학생",
    "support_detail": "장학금, 생활비 지원",
    "link": "https://example.com/apply",
    "agency": "교육부"
},
{
    "title": "2024 학생지원 프로그램2",
    "startdate": "2024-08-01T00:00:00.000Z",
    "enddate": "2024-12-31T23:59:59.000Z",
    "resultdate": "2025-01-15T00:00:00.000Z",
    "logo": "logo.png",
    "pic1": "pic1.jpg",
    "pic2": "pic2.jpg",
    "pic3": "pic3.jpg",
    "pic4": "pic4.jpg",
    "pic5": "pic5.jpg",
    "body": "이 프로그램은 학생들의 다양한 활동을 지원하기 위해 마련되었습니다.",
    "support_target": "모든 학부생",
    "application_method": "온라인 신청",
    "qualification": "재학생",
    "support_detail": "장학금, 생활비 지원",
    "link": "https://example.com/apply",
    "agency": "교육부"
},
{
    "title": "2024 학생지원 프로그램3",
    "startdate": "2024-08-01T00:00:00.000Z",
    "enddate": "2024-12-31T23:59:59.000Z",
    "resultdate": "2025-01-15T00:00:00.000Z",
    "logo": "logo.png",
    "pic1": "pic1.jpg",
    "pic2": "pic2.jpg",
    "pic3": "pic3.jpg",
    "pic4": "pic4.jpg",
    "pic5": "pic5.jpg",
    "body": "이 프로그램은 학생들의 다양한 활동을 지원하기 위해 마련되었습니다.",
    "support_target": "모든 학부생",
    "application_method": "온라인 신청",
    "qualification": "재학생",
    "support_detail": "장학금, 생활비 지원",
    "link": "https://example.com/apply",
    "agency": "교육부"
}
];

async function seedStudent() {
    try {
      // 데이터베이스 연결 확인
      await sequelize.authenticate();
  
      // 학생지원 데이터 삽입
      await StudentSupportInfo.bulkCreate(studentSupports, { ignoreDuplicates: true });
      console.log('학생지원이 성공적으로 삽입되었습니다.');
  
      console.log('데이터베이스 시딩이 완료되었습니다.');
    } catch (error) {
      console.error('데이터베이스 시딩 중 오류 발생:', error);
    } finally {
      // 데이터베이스 연결 종료
      await sequelize.close();
      console.log('데이터베이스 연결이 종료되었습니다.');
    }
  }
  
  // 시딩 함수 실행
  seedStudent();