const asyncHandler = require("express-async-handler");
const StudyboardComment = require("../../models/StudyBoard/studyboardComment");
const Studyboard = require("../../models/StudyBoard/studyboard");

/**
 * 특정 게시글 댓글 전체 가져오기
 * GET /api/studyboardComment/:studyboardkey
 */
const showAll = asyncHandler(async (req, res) => {
    const { studyboardkey } = req.params;
    // const userId = "user11"; // 현재 로그인한 id, 후에 쿠키를 통해 받아올 것
    const id= req.user.email;
    console.log(id);

    try {
        
        // 게시글 작성자 ID 가져오기
        const studyboard = await Studyboard.findByPk(studyboardkey, {
            attributes: ['id'],
            raw: true
        });

        if (!studyboard) {
            return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
        }

        console.log("로그인한 사용자 ID:", id);
        console.log("게시글 작성자 ID:", studyboard.id);

        const data = await StudyboardComment.findAll({
            where: { studyboardkey },
            raw: true // 순수한 JSON 객체로 반환
        });

        const modifiedData = data.map(comment => {
            console.log("댓글 작성자 ID:", comment.id);
            if (comment.isSecret && comment.id !== id && studyboard.id !== id) {
                comment.comment = "비밀댓글입니다.";
            }
            return comment;
        });

        res.status(200).json(modifiedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "댓글을 가져오는 중 오류가 발생했습니다." });
    }
});

/**
 * 특정 게시글 댓글 생성
 * POST /api/studyboardComment/create/:studyboardkey
 */
const createComment = asyncHandler(async (req, res) => {
    const { studyboardkey } = req.params;
    const { comment, isSecret } = req.body; 
    // const id= "user123" // id값은 쿠키를 통해 받아오도록 수정할 것
    const id= req.user.email;

    try {
        const newData = await StudyboardComment.create({
            id,
            comment,
            studyboardkey,
            isSecret
        });
        res.status(201).json(newData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "댓글 생성 중 오류가 발생했습니다." });
    }
});

/**
 * 특정 게시글 댓글 삭제
 * DELETE /api/studyboardComment/delete/:studyboardkey/:commentkey
 */
const deleteComment = asyncHandler(async (req, res) => {
    const { studyboardkey, commentkey } = req.params;
    // const id= "user12344"; // id값은 쿠키를 통해 받아오도록 수정할 것
    const id= req.user.email;
    
    try {
        const comment = await StudyboardComment.findOne({
            where: {
                commentKey: commentkey,
                studyboardkey: studyboardkey
            }
        });

        // 댓글이 없는 경우
        if (!comment) {
            return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
        }

        // 댓글 작성자와 현재 사용자가 다른 경우
        if (comment.id !== id) {
            return res.status(403).json({ message: "이 댓글을 삭제할 권한이 없습니다." });
        }

        // 댓글 삭제
        await comment.destroy();
        res.status(200).json({ message: "댓글이 삭제되었습니다." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "댓글 삭제 중 오류가 발생했습니다." });
    }
});

module.exports = { showAll, createComment, deleteComment };
