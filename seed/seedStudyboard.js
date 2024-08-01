const { sequelize } = require('../config/db');
const Studyboard = require('../models/StudyBoard/studyboard');

// 스터디 모집 데이터
const studyboards = [
    {
        "title": "알고리즘 스터디 모집",
        "body": "코딩 테스트 준비를 위한 알고리즘 스터디원을 모집합니다. 주 2회 온라인 모임.",
        "pic1": "algorithm_study.jpg",
        "pic2": "coding_test.jpg"
      },
      {
        "title": "React 스터디 그룹",
        "body": "React와 관련 라이브러리를 함께 공부할 스터디원을 찾습니다. 초보자 환영!",
        "pic1": "react_logo.jpg",
        "pic2": "study_group.jpg"
      },
      {
        "title": "데이터 사이언스 입문 스터디",
        "body": "Python을 이용한 데이터 분석 기초부터 머신러닝까지 함께 공부해요.",
        "pic1": "data_science.jpg",
        "pic2": "python_logo.jpg"
      },
      {
        "title": "클라우드 자격증 준비 모임",
        "body": "AWS 자격증 취득을 목표로 하는 스터디입니다. 주 1회 오프라인 모임.",
        "pic1": "aws_cert.jpg",
        "pic2": "cloud_computing.jpg"
      },
      {
        "title": "프론트엔드 포트폴리오 스터디",
        "body": "함께 프로젝트를 진행하며 포트폴리오를 만들어가는 스터디입니다.",
        "pic1": "portfolio.jpg",
        "pic2": "frontend_tech.jpg"
      }
];

// 데이터베이스 시딩 함수
async function seedStudyboard() {
  try {
    // 데이터베이스 연결 확인
    await sequelize.authenticate();

    // 스터디 데이터 삽입
    await Studyboard.bulkCreate(studyboards, { ignoreDuplicates: true });
    console.log('스터디 모집 글이 성공적으로 삽입되었습니다.');

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
seedStudyboard();