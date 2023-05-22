
import http from "http";
import express from "express"; 
import SocketIO from "socket.io";

const app = express(); 

app.set("view engine", "pug"); 
app.set("views", __dirname + "/views"); 
app.use("/public", express.static(__dirname + "/public")); 
app.get("/", (req, res) => res.render("home")); 
app.get("/*", (req, res) => res.redirect("/"));

const httpServer = http.createServer(app); // 서버 생성

const wsServer = SocketIO(httpServer); // 소켓 서버랑 합치기

// 소켓 연결 시
wsServer.on("connection", (socket) => {
    socket.on("join_room", (roomName) => {
        socket.join(roomName);
        socket.to(roomName).emit("welcome");
    });
    socket.on("offer", (offer, roomName) => { // offer가 들어오면 roomName에 있는 사람들에게 offer를 전송
        socket.to(roomName).emit("offer", offer);
    });
    socket.on("answer", (answer, roomName) => {
        socket.to(roomName).emit("answer", answer);
    });
    socket.on("ice", (ice, roomName) => {
        socket.to(roomName).emit("ice", ice);
    });
  });
  
const handleListen = () => console.log(`Listening on http://localhost:3000`)
httpServer.listen(3000, handleListen);