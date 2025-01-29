const express = require("express");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("새 클라이언트 연결됨!");

  ws.on("message", (message) => {
    console.log("메시지 수신:", message.toString());

    // 발신자를 제외한 다른 클라이언트들에게만 메시지 전달
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
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