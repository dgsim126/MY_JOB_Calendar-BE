const asyncHandler = require("express-async-handler");
const FreeBoard = require("../../models/FreeBoard/freeboard");
const FreeBoardComment = require("../../models/FreeBoard/freeboardComment"); // 댓글 모델 추가
const { sequelize } = require('../../config/db'); // Sequelize 인스턴스 가져오기
const { Op } = require('sequelize');

/**
 * Base64 문자열을 바이너리 데이터로 변환
 * @param {string} base64String - Base64로 인코딩된 문자열
 * @returns {Buffer} - 변환된 바이너리 데이터
 */
const base64ToBinary = (base64String) => {
    return Buffer.from(base64String, 'base64');
};

/**
 * 바이너리 데이터를 Base64 문자열로 변환
 * @param {Buffer} binaryData - 바이너리 데이터
 * @returns {string} - Base64 문자열
 */
const binaryToBase64 = (binaryData) => {
    return binaryData.toString('base64');
};

/**
 * 모든 게시글 가져오기 (댓글 수 포함)
 * GET /api/freeboard
 */
const showAll = asyncHandler(async (req, res) => {
    try {
        // 모든 게시글을 가져오면서 댓글 수를 계산하여 포함
        const data = await FreeBoard.findAll({
            attributes: {
                include: [
                    [sequelize.fn('COUNT', sequelize.col('FreeBoardComments.commentKey')), 'commentCount']
                ]
            },
            include: [
                {
                    model: FreeBoardComment,
                    attributes: [] // 댓글의 세부정보를 포함하지 않음
                }
            ],
            group: ['FreeBoard.key'] // group by 게시글의 key
        });

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
});

/**
 * 게시글 상세 조회
 * GET /api/freeboard/:key
 */
const showDetail = asyncHandler(async (req, res) => {
    const { key } = req.params;
    try {
        const data = await FreeBoard.findByPk(key);
        if (!data) {
            res.status(404).json({ message: "게시글을 찾을 수 없음." });
            return;
        }
        
        // 바이너리 데이터를 Base64 문자열로 변환
        if (data.pic1) data.pic1 = binaryToBase64(data.pic1);
        if (data.pic2) data.pic2 = binaryToBase64(data.pic2);

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "서버 에러." });
    }
});

/**
 * 게시글 작성 내용을 DB에 넣기
 * POST /api/freeboard/create
 */
const createPost = asyncHandler(async (req, res) => {
    const { title, body, pic1, pic2 } = req.body;
    const id = req.user.email;
    console.log(req);

    try {
        // Base64 문자열을 바이너리 데이터로 변환
        const pic1Binary = pic1 ? base64ToBinary(pic1) : null;
        const pic2Binary = pic2 ? base64ToBinary(pic2) : null;

        const newData = await FreeBoard.create({
            id,
            title,
            body,
            pic1: pic1Binary,
            pic2: pic2Binary
        });
        res.status(201).json(newData);
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: "게시글 작성 중 오류." });
    }
});

/**
 * 게시글 수정 내용을 DB에 넣기
 * PUT /api/freeboard/update/:key
 */
const updatePost = asyncHandler(async (req, res) => {
    const { key } = req.params;
    const { title, body, pic1, pic2 } = req.body;
    const id = req.user.email;

    try {
        // 수정할 게시글 찾기
        const post = await FreeBoard.findByPk(key);

        if (!post) {
            return res.status(404).json({ message: "수정할 게시글을 찾을 수 없음." });
        }

        if (post.id !== id) {
            return res.status(403).json({ message: "수정 권한이 없음." });
        }

        // Base64 문자열을 바이너리 데이터로 변환
        const pic1Binary = pic1 ? base64ToBinary(pic1) : post.pic1;
        const pic2Binary = pic2 ? base64ToBinary(pic2) : post.pic2;

        // 게시글 수정
        await FreeBoard.update({
            title,
            body,
            pic1: pic1Binary,
            pic2: pic2Binary
        }, {
            where: { key }
        });

        // 수정된 데이터 다시 불러오기
        const afterUpdated = await FreeBoard.findByPk(key);

        // 바이너리 데이터를 Base64 문자열로 변환
        if (afterUpdated.pic1) afterUpdated.pic1 = binaryToBase64(afterUpdated.pic1);
        if (afterUpdated.pic2) afterUpdated.pic2 = binaryToBase64(afterUpdated.pic2);

        res.status(200).json(afterUpdated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "서버 에러." });
    }
});

/**
 * 게시글 삭제
 * DELETE /api/freeboard/delete/:key
 */
const deletePost = asyncHandler(async (req, res) => {
    const { key } = req.params;
    const id = req.user.email;

    try {
        // 삭제하려는 게시글 찾기
        const post = await FreeBoard.findOne({
            where: { key }
        });

        // 게시글이 없는 경우
        if (!post) {
            return res.status(404).json({ message: "수정할 게시글을 찾을 수 없음." });
        }

        // 게시글 작성자와 현재 사용자가 다른 경우
        if (post.id !== id) {
            return res.status(403).json({ message: "수정 권한이 없음." });
        }

        // 연결된 댓글 모두 삭제
        await FreeBoardComment.destroy({
            where: { freeboardkey: key }
        });

        // 게시글 삭제
        await post.destroy();
        res.status(200).json({ message: "삭제 완료." });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: "서버 에러." });
    }
});

/**
 * 제목으로 게시글 검색
 * POST /api/freeboard/search
 */
const searchByTitle = asyncHandler(async (req, res) => {
    const { title } = req.body; // 요청 본문에서 제목을 가져옴

    if (!title) {
        return res.status(400).json({ message: "검색어가 필요합니다." });
    }

    try {
        const posts = await FreeBoard.findAll({
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




module.exports = { showAll, showDetail, createPost, updatePost, deletePost, searchByTitle };