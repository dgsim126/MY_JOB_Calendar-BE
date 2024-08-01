const asyncHandler = require("express-async-handler");
const { sequelize } = require("../../config/db");
const Company = require("../../models/Company/company");
const Scrap = require("../../models/Scrap/scrap");
const { Op } = require('sequelize');

const RecruitmentNoticeInfo = require("../../models/ITInfo/RecruitmentNoticeInfo/recruitmentNoticeInfoModel");
const { Sequelize } = require("sequelize");

// GET api/company
// 모든 회사의 특정 정보 (스크랩 인수 포함)
const getCompanies = asyncHandler(async (req, res) => {
  try {
    const companies = await Company.findAll({
      attributes: [
        "companyID",
        "companyName",
        "establish",
        "logo",
        "track",
        "stack",
        [
          sequelize.fn("COUNT", sequelize.col("Scraps.companyID")),
          "scrapCount",
        ],
        [
          sequelize.literal(`(
          SELECT COUNT(*)
          FROM recruitmentNoticeInfo
          WHERE recruitmentNoticeInfo.companyname = Company.companyName
        )`),
          "recruitmentNoticeCount",
        ], // 채용공고에서는 companyname임에 주의.
      ],
      include: [
        {
          model: Scrap,
          attributes: [],
        },
      ],
      group: ["Company.companyID"],
    });
    res.status(200).json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// GET api/company/:companyID
// 특정 회사의 모든 정보 (스크랩 인수 포함)
const getCompanyById = asyncHandler(async (req, res) => {
  const { companyID } = req.params;
  const user = req.user;
  const userID = user ? user.userID : null;
  
  try {
    const company = await Company.findByPk(companyID, {
      include: [
        {
          model: Scrap,
          attributes: [],
        },
      ],
      attributes: {
        include: [
          [
            sequelize.fn("COUNT", sequelize.col("Scraps.companyID")),
            "scrapCount",
          ],
        ],
      },
      group: ["Company.companyID"],
    });

    if (!company) {
      return res.status(404).send("Company not found");
    }

    // track과 stack 필드를 배열로 변환
    const tracks = company.track ? company.track.split(",") : [];
    const stacks = company.stack ? company.stack.split(",") : [];

    // 🌟[로직추가] - 동일한 track을 가진 다른 회사 리스트 조회
    const otherCompanies = await Company.findAll({
      where: {
        track: company.track,
        companyID: {
          [Sequelize.Op.ne]: companyID, // 현재 조회된 회사를 제외시킨다.
        },
      },
      attributes: [
        "companyID",
        "companyName",
        "establish",
        "logo",
        "track",
        "stack",
        [
          sequelize.fn("COUNT", sequelize.col("Scraps.companyID")),
          "scrapCount",
        ],
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM recruitmentNoticeInfo
            WHERE recruitmentNoticeInfo.companyname = Company.companyName
          )`),
          "recruitmentNoticeCount",
        ], // 채용공고에서는 companyname임에 주의.
      ],
      include: [
        {
          model: Scrap,
          attributes: [],
        },
      ],
      group: ["Company.companyID"],
    });


    // 🌟 사용자가 이 회사를 스크랩했는지 여부 체크
    let isScrapped = false;
    if (userID) {
      const scrap = await Scrap.findOne({
        where: {
          userID: userID,
          companyID: companyID
        }
      });
      isScrapped = !!scrap;
    }


    // JSON 응답에 track과 stack 배열 포함
    const companyData = {
      ...company.toJSON(),
      track: tracks,
      stack: stacks,
      otherCompanies, // 다른 비슷한 회사정보 추가.
      isScrapped: !!isScrapped
    };

    res.status(200).json(companyData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// POST /api/company/:companyID/scrap
// 관심 회사 스크랩
const scrapCompany = asyncHandler(async (req, res) => {
  const userID = req.user.userID; // 로그인된 유저 ID 가져오기
  const { companyID } = req.params;

  try {
    // 스크랩 중복 체크
    const existingScrap = await Scrap.findOne({
      where: {
        userID,
        companyID,
      },
    });
    if (existingScrap) {
      return res.status(400).json({ message: "Already scrapped this company" });
    }
    // 스크랩 생성
    await Scrap.create({
      userID,
      companyID,
    });

    res.status(201).json({ message: "Company scrapped successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// DELETE api/company/:companyID/scrap
// 스크랩 삭제
const deleteScrap = asyncHandler(async (req, res) => {
  const { companyID } = req.params;
  const userID = req.user.userID;

  try {
    const scrap = await Scrap.findOne({
      where: {
        companyID,
        userID,
      },
    });

    if (!scrap) {
      return res.status(404).send("Scrap not found");
    }

    await scrap.destroy();
    res.status(200).send("Scrap deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// POST api/company/admin
// ⭐관리자 - 기업 목록 추가
const createCompany = asyncHandler(async (req, res) => {
  const {
    companyName,
    establish,
    logo,
    pic1,
    pic2,
    pic3,
    pic4,
    pic5,
    body,
    track,
    stack,
    welfare,
    salary,
    location,
    employee,
    link,
    revenue,
  } = req.body;

  try {
    // 필수 필드 체크
    if (!companyName || !body) {
      return res
        .status(400)
        .json({ message: "Company name and body are required" });
    }

    // track과 stack이 배열로 전달된 경우 쉼표로 구분된 문자열로 변환
    const trackString = Array.isArray(track) ? track.join(",") : track;
    const stackString = Array.isArray(stack) ? stack.join(",") : stack;

    // 새로운 회사 데이터 생성
    const newCompany = await Company.create({
      companyName,
      establish,
      logo,
      pic1,
      pic2,
      pic3,
      pic4,
      pic5,
      body,
      track: trackString,
      stack: stackString,
      welfare,
      salary,
      location,
      employee,
      link,
      revenue,
    });

    res.status(201).json(newCompany);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// DELETE api/company/admin/:companyID
// ⭐관리자 - 기업 목록 삭제
const deleteCompany = asyncHandler(async (req, res) => {
  const { companyID } = req.params;

  try {
    const company = await Company.findByPk(companyID);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    await Scrap.destroy({ where: { companyID: companyID } });
    await company.destroy();

    res.status(204).send(); // No Content
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

/**
 * 회사이름으로 게시글 검색
 * POST /api/company/search
 */
const searchByCompanyName = asyncHandler(async (req, res) => {
  const { companyName } = req.body; // 요청 본문에서 제목을 가져옴
  console.log("받은 검색 내용", companyName);

  if (!companyName) {
    return res.status(400).json({ message: "검색어가 필요합니다." });
  }

  try {
    const posts = await Company.findAll({
      where: {
        companyName: {
          [Op.like]: `%${companyName}%`, // 제목에 검색어가 포함된 게시글 찾기
        },
      },
    });

    console.log("찾은 결과", posts);

    if (posts.length === 0) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error searching posts by title:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

module.exports = {
  getCompanies,
  getCompanyById,
  scrapCompany,
  deleteScrap,
  createCompany,
  deleteCompany,
  searchByCompanyName,
};
