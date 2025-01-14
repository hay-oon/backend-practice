import express from "express";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";

const router = express.Router();

// POST /api/blogs
router.post("/", async (req, res) => {
  try {
    const { title, content, author } = req.body;

    if (!title || !content || !author) {
      return res.status(400).send({ message: "please fill all fields" });
    }

    const blog = new Blog({ title, content, author });
    await blog.save();
    res.status(201).send(blog);
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

////////////////////////////////////////////////////////////
// 댓글 관련 API
////////////////////////////////////////////////////////////

router.post("/:id/comments", async (req, res) => {
  try {
    const { content, author } = req.body;

    if (!content || !author) {
      return res.status(400).send({ message: "please fill all fields" });
    }

    const comment = new Comment({
      content,
      author,
      blogId: req.params.id,
    });
    await comment.save();
    res.status(201).send(comment);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// 댓글 조회
router.get("/:id/comments", async (req, res) => {
  try {
    const comments = await Comment.find({ blogId: req.params.id }).sort({
      createdAt: -1,
    });
    res.send(comments);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// 댓글 수정
router.patch("/:blogId/comments/:commentId", async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      { content },
      { new: true }
    );

    if (!comment) {
      return res.status(404).send({ message: "can't find comment" });
    }

    res.send(comment);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// 댓글 삭제
router.delete("/:blogId/comments/:commentId", async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.commentId);
    if (!comment) {
      return res.status(404).send({ message: "can't find comment" });
    }
    res.send({ message: "comment deleted" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default router;
