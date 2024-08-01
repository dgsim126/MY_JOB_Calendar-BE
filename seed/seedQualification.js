const { sequelize } = require('../config/db');
const QualificationInfo = require('../models/ITInfo/QualificationInfo/qualificationInfoModel');

const qualifications = [
{
    "title": "2024 국가공인 자격증 시험1",
    "startdate": "2024-08-01T00:00:00.000Z",
    "enddate": "2024-12-31T23:59:59.000Z",
    "exam_startdate": "2024-10-01T00:00:00.000Z",
    "exam_enddate": "2024-10-02T00:00:00.000Z",
    "resultdate": "2025-01-15T00:00:00.000Z",
    "logo": "logo.png",
    "pic1": "pic1.jpg",
    "pic2": "pic2.jpg",
    "pic3": "pic3.jpg",
    "pic4": "pic4.jpg",
    "pic5": "pic5.jpg",
    "body": "이 시험은 국가에서 공인된 자격증을 취득할 수 있는 기회를 제공합니다.",
    "pass_standard": "60점 이상",
    "workview": "자격증 취득 후 다양한 경로로 진로를 개척할 수 있습니다.",
    "qualification": "고등학교 졸업 이상",
    "testinfo": "필기 시험과 실기 시험으로 구성됩니다.",
    "problems": "https://example.com/problems",
    "qualification_name": "국가공인 자격증",
    "relate_department": "교육부",
    "agency": "교육부",
    "link": "https://example.com/apply",
    "fee": "50,000원"
},
{
    "title": "2024 국가공인 자격증 시험2",
    "startdate": "2024-08-01T00:00:00.000Z",
    "enddate": "2024-12-31T23:59:59.000Z",
    "exam_startdate": "2024-10-01T00:00:00.000Z",
    "exam_enddate": "2024-10-02T00:00:00.000Z",
    "resultdate": "2025-01-15T00:00:00.000Z",
    "logo": "logo.png",
    "pic1": "pic1.jpg",
    "pic2": "pic2.jpg",
    "pic3": "pic3.jpg",
    "pic4": "pic4.jpg",
    "pic5": "pic5.jpg",
    "body": "이 시험은 국가에서 공인된 자격증을 취득할 수 있는 기회를 제공합니다.",
    "pass_standard": "60점 이상",
    "workview": "자격증 취득 후 다양한 경로로 진로를 개척할 수 있습니다.",
    "qualification": "고등학교 졸업 이상",
    "testinfo": "필기 시험과 실기 시험으로 구성됩니다.",
    "problems": "https://example.com/problems",
    "qualification_name": "국가공인 자격증",
    "relate_department": "교육부",
    "agency": "교육부",
    "link": "https://example.com/apply",
    "fee": "50,000원"
},
{
    "title": "2024 국가공인 자격증 시험3",
    "startdate": "2024-08-01T00:00:00.000Z",
    "enddate": "2024-12-31T23:59:59.000Z",
    "exam_startdate": "2024-10-01T00:00:00.000Z",
    "exam_enddate": "2024-10-02T00:00:00.000Z",
    "resultdate": "2025-01-15T00:00:00.000Z",
    "logo": "logo.png",
    "pic1": "pic1.jpg",
    "pic2": "pic2.jpg",
    "pic3": "pic3.jpg",
    "pic4": "pic4.jpg",
    "pic5": "pic5.jpg",
    "body": "이 시험은 국가에서 공인된 자격증을 취득할 수 있는 기회를 제공합니다.",
    "pass_standard": "60점 이상",
    "workview": "자격증 취득 후 다양한 경로로 진로를 개척할 수 있습니다.",
    "qualification": "고등학교 졸업 이상",
    "testinfo": "필기 시험과 실기 시험으로 구성됩니다.",
    "problems": "https://example.com/problems",
    "qualification_name": "국가공인 자격증",
    "relate_department": "교육부",
    "agency": "교육부",
    "link": "https://example.com/apply",
    "fee": "50,000원"
}
];

async function seedQualification() {
    try {
      // 데이터베이스 연결 확인
      await sequelize.authenticate();
  
      // 자격증 데이터 삽입
      await QualificationInfo.bulkCreate(qualifications, { ignoreDuplicates: true });
      console.log('자격증이 성공적으로 삽입되었습니다.');
  
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
  seedQualification();