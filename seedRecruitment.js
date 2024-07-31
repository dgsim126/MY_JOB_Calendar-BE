const { sequelize } = require('./config/db');
const RecruitmentNoticeInfo = require('./models/ITInfo/RecruitmentNoticeInfo/recruitmentNoticeInfoModel');

const recruitmentNotices = [
    {
        "title": "2024년 상반기 신입사원 채용 공고",
        "startdate": "2024-08-01T00:00:00.000Z",
        "enddate": "2024-08-31T23:59:59.000Z",
        "resultdate": "2024-09-15T00:00:00.000Z",
        "pic1": "pic1.jpg",
        "pic2": "pic2.jpg",
        "pic3": "pic3.jpg",
        "pic4": "pic4.jpg",
        "pic5": "pic5.jpg",
        "body": "우리 회사에서는 2024년 상반기 신입사원을 모집합니다. 많은 지원 바랍니다.",
        "experience": "신입 가능",
        "education": "학사 이상",
        "stack": "JavaScript, Node.js, React",
        "qualification": "관련 학과 졸업자",
        "preferences": "유관 경력자 우대",
        "work_type": "정규직",
        "salary": "연봉 3,500만원 이상",
        "location": "서울특별시",
        "work_time": "주 5일, 09:00 ~ 18:00",
        "recruit_part": "개발, 디자인, 마케팅",
        "duties": "웹 개발, UI/UX 디자인, 마케팅 전략 수립",
        "key_skills": "문제 해결 능력, 팀워크, 커뮤니케이션",
        "recruit_num": 3,
        "link": "https://example.com/apply",
        "companyname": "ABC Corporation"
      },
      {
        "title": "경력직 백엔드 개발자 모집",
        "startdate": "2024-09-01T00:00:00.000Z",
        "enddate": "2024-09-30T23:59:59.000Z",
        "resultdate": "2024-10-15T00:00:00.000Z",
        "pic1": "backend_pic1.jpg",
        "pic2": "backend_pic2.jpg",
        "body": "백엔드 개발자를 모집합니다. Java, Spring 전문가를 찾습니다.",
        "experience": "3년 이상",
        "education": "학사 이상",
        "stack": "Java, Spring, MySQL",
        "work_type": "정규직",
        "salary": "연봉 5,000만원 이상",
        "location": "부산광역시",
        "companyname": "Tech Solutions Inc."
      },
      {
        "title": "AI 연구원 채용",
        "startdate": "2024-10-01T00:00:00.000Z",
        "enddate": "2024-10-31T23:59:59.000Z",
        "resultdate": "2024-11-15T00:00:00.000Z",
        "pic1": "ai_pic1.jpg",
        "body": "AI 연구소에서 머신러닝 전문가를 모집합니다.",
        "experience": "신입 및 경력",
        "education": "석사 이상",
        "stack": "Python, TensorFlow, PyTorch",
        "work_type": "정규직",
        "salary": "연봉 6,000만원 이상",
        "location": "대전광역시",
        "companyname": "AI Research Lab"
      },
      {
        "title": "프론트엔드 개발자 채용",
        "startdate": "2024-11-01T00:00:00.000Z",
        "enddate": "2024-11-30T23:59:59.000Z",
        "resultdate": "2024-12-15T00:00:00.000Z",
        "pic1": "frontend_pic1.jpg",
        "body": "React 전문가를 찾습니다. 최신 웹 기술에 관심 있는 분들의 지원을 기다립니다.",
        "experience": "2년 이상",
        "education": "학력 무관",
        "stack": "React, Redux, TypeScript",
        "work_type": "정규직",
        "salary": "연봉 4,500만원 이상",
        "location": "서울특별시",
        "companyname": "Web Wizards Co."
      },
      {
        "title": "데이터 분석가 모집",
        "startdate": "2024-12-01T00:00:00.000Z",
        "enddate": "2024-12-31T23:59:59.000Z",
        "resultdate": "2025-01-15T00:00:00.000Z",
        "pic1": "data_pic1.jpg",
        "body": "빅데이터 분석 전문가를 찾습니다. 통계와 프로그래밍 실력을 겸비한 분을 모십니다.",
        "experience": "5년 이상",
        "education": "석사 이상",
        "stack": "Python, R, SQL, Hadoop",
        "work_type": "정규직",
        "salary": "연봉 7,000만원 이상",
        "location": "성남시",
        "companyname": "Data Insights Corp."
      },
      {
        "title": "2024년 상반기 신입사원 채용 공고6",
        "startdate": "2024-08-01T00:00:00.000Z",
        "enddate": "2024-08-31T23:59:59.000Z",
        "resultdate": "2024-09-15T00:00:00.000Z",
        "pic1": "pic1.jpg",
        "pic2": "pic2.jpg",
        "pic3": "pic3.jpg",
        "pic4": "pic4.jpg",
        "pic5": "pic5.jpg",
        "body": "우리 회사에서는 2024년 상반기 신입사원을 모집합니다. 많은 지원 바랍니다.",
        "experience": "신입 가능",
        "education": "학사 이상",
        "stack": "JavaScript, Node.js, React",
        "qualification": "관련 학과 졸업자",
        "preferences": "유관 경력자 우대",
        "work_type": "정규직",
        "salary": "연봉 3,500만원 이상",
        "location": "서울특별시",
        "work_time": "주 5일, 09:00 ~ 18:00",
        "recruit_part": "개발, 디자인, 마케팅",
        "duties": "웹 개발, UI/UX 디자인, 마케팅 전략 수립",
        "key_skills": "문제 해결 능력, 팀워크, 커뮤니케이션",
        "recruit_num": 3,
        "link": "https://example.com/apply",
        "companyname": "ABC Corporation"
      },
      {
        "title": "2024년 상반기 신입사원 채용 공고7",
        "startdate": "2024-08-01T00:00:00.000Z",
        "enddate": "2024-08-31T23:59:59.000Z",
        "resultdate": "2024-09-15T00:00:00.000Z",
        "pic1": "pic1.jpg",
        "pic2": "pic2.jpg",
        "pic3": "pic3.jpg",
        "pic4": "pic4.jpg",
        "pic5": "pic5.jpg",
        "body": "우리 회사에서는 2024년 상반기 신입사원을 모집합니다. 많은 지원 바랍니다.",
        "experience": "신입 가능",
        "education": "학사 이상",
        "stack": "JavaScript, Node.js, React",
        "qualification": "관련 학과 졸업자",
        "preferences": "유관 경력자 우대",
        "work_type": "정규직",
        "salary": "연봉 3,500만원 이상",
        "location": "서울특별시",
        "work_time": "주 5일, 09:00 ~ 18:00",
        "recruit_part": "개발, 디자인, 마케팅",
        "duties": "웹 개발, UI/UX 디자인, 마케팅 전략 수립",
        "key_skills": "문제 해결 능력, 팀워크, 커뮤니케이션",
        "recruit_num": 3,
        "link": "https://example.com/apply",
        "companyname": "ABC Corporation"
      },
      {
        "title": "2024년 상반기 신입사원 채용 공고8",
        "startdate": "2024-08-01T00:00:00.000Z",
        "enddate": "2024-08-31T23:59:59.000Z",
        "resultdate": "2024-09-15T00:00:00.000Z",
        "pic1": "pic1.jpg",
        "pic2": "pic2.jpg",
        "pic3": "pic3.jpg",
        "pic4": "pic4.jpg",
        "pic5": "pic5.jpg",
        "body": "우리 회사에서는 2024년 상반기 신입사원을 모집합니다. 많은 지원 바랍니다.",
        "experience": "신입 가능",
        "education": "학사 이상",
        "stack": "JavaScript, Node.js, React",
        "qualification": "관련 학과 졸업자",
        "preferences": "유관 경력자 우대",
        "work_type": "정규직",
        "salary": "연봉 3,500만원 이상",
        "location": "서울특별시",
        "work_time": "주 5일, 09:00 ~ 18:00",
        "recruit_part": "개발, 디자인, 마케팅",
        "duties": "웹 개발, UI/UX 디자인, 마케팅 전략 수립",
        "key_skills": "문제 해결 능력, 팀워크, 커뮤니케이션",
        "recruit_num": 3,
        "link": "https://example.com/apply",
        "companyname": "ABC Corporation"
      }
];

// 데이터베이스 시딩 함수
async function seedRecruitment() {
  try {
    // 데이터베이스 연결 확인
    await sequelize.authenticate();

    // 채용 공고 데이터 삽입
    await RecruitmentNoticeInfo.bulkCreate(recruitmentNotices, { ignoreDuplicates: true });
    console.log('채용 공고가 성공적으로 삽입되었습니다.');

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
seedRecruitment();