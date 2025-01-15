import express from "express";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";

const router = express.Router();

// POST /api/blogs
router.post("/", async (req, res) => {
  try {
    const { title, content, author } = req.body; // 요청 본문에서 데이터 추출

    if (!title || !content || !author) {
      return res.status(400).send({ message: "please fill all fields" });
    }

    const blog = new Blog({ title, content, author }); // 새로운 블로그 포스트 생성
    await blog.save(); // 데이터베이스에 저장
    res.status(201).send(blog); // 생성된 블로그 포스트 응답
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// GET /api/blogs?limit=10
router.get("/", async (req, res) => {
  try {
    const limit = Number(req.query.limit);
    const blogs = await Blog.find().sort({ createdAt: -1 }).limit(limit);
    res.send(blogs);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// 특정 블로그 포스트 조회
// GET /api/blogs/:id
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).send({ message: "can't find blog" });
    }
    res.send(blog);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// PATCH /api/blogs/:id
router.patch("/:id", async (req, res) => {
  try {
    const { title, content } = req.body;
    const updateData = {};

    if (title) updateData.title = title;
    if (content) updateData.content = content;

    const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!blog) {
      return res.status(404).send({ message: "can't find blog" });
    }

    res.send(blog);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// DELETE /api/blogs/:id
router.delete("/:id", async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).send({ message: "can't find blog" });
    }

    // 관련된 댓글들도 모두 삭제
    await Comment.deleteMany({ blogId: req.params.id });

    res.send({ message: "blog deleted" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default router;
