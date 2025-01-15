import express from "express";
import blogRouter from "./blogs.js";
import commentRouter from "./comments.js";

const router = express.Router();

// 블로그 라우터 연결
router.use("/blogs", blogRouter);

// 댓글 라우터 연결
router.use("/blogs/:id/comments", commentRouter);

export default router;
