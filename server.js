const express = require("express");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
const port = 3001; // 원하는 포트 번호 설정

app.use(cors());
app.use(express.json());

// WebSocket 서버 생성
const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("새 클라이언트 연결됨!");

  ws.on("message", (message) => {
    console.log("메시지 수신:", message.toString());

    // 모든 클라이언트에게 메시지 전달 (브로드캐스트)
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on("close", () => {
    console.log("클라이언트 연결 종료");
  });
});

server.listen(port, () => {
  console.log(`✅ WebSocket 서버 실행 중: ws://localhost:${port}`);
});