import express from "express";
import Comment from "../models/Comment.js";

const router = express.Router({ mergeParams: true }); // 미들웨어 연결

// POST /api/blogs/:id/comments
router.post("/", async (req, res) => {
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

// GET /api/blogs/:id/comments
router.get("/", async (req, res) => {
  try {
    const comments = await Comment.find({ blogId: req.params.id }).sort({
      createdAt: -1,
    });
    res.send(comments);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// PATCH /api/blogs/:blogId/comments/:commentId
router.patch("/:commentId", async (req, res) => {
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

// DELETE /api/blogs/:blogId/comments/:commentId
router.delete("/:commentId", async (req, res) => {
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
