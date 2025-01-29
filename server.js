const express = require("express");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });

function heartbeat() {
  this.isAlive = true;
}

wss.on("connection", (ws) => {
  console.log("새 클라이언트 연결됨!");
  
  // 연결된 클라이언트의 상태 초기화
  ws.isAlive = true;
  ws.on('pong', heartbeat);

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

// 주기적으로 연결 상태 체크 (30초마다)
const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on('close', () => {
  clearInterval(interval);
});

server.listen(port, () => {
  console.log(`✅ WebSocket 서버 실행 중: ws://localhost:${port}`);
});