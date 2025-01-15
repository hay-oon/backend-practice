import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import apiRouter from "./routes/index.js";

dotenv.config();

const app = express();

// JSON 형식의 요청 본문을 파싱하기 위한 미들웨어
app.use(express.json());

// 환경 변수 사용
const { DATABASE_URL, PORT } = process.env;

// MongoDB 데이터베이스 연결
mongoose
  .connect(DATABASE_URL)
  .then(() => console.log("DB 연결 성공"))
  .catch((err) => console.error("DB 연결 실패:", err));

// API 라우터 연결
app.use("/api", apiRouter);

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
