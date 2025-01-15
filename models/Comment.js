import mongoose from "mongoose";

// Comment 스키마 정의
const CommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    depth: {
      type: Number,
      default: 1,
      max: 2,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;
