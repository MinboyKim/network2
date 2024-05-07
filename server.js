const fs = require("fs");
const app = require("express")();

const server = app.listen(6443, () => {
    console.log("Server is running on port 6443");
});

const SocketIO = require("socket.io");
const io = SocketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    socket.on("disconnect", () => {
        console.log("클라이언트 접속 해제", socket.id);
        clearInterval(socket.interval);
    });

    socket.on("error", (error) => {
        console.error(error);
    });

    socket.on("button-clicked", (filename) => {
        fs.readFile(filename, "utf8", (err, data) => {
            if (err) {
                socket.emit("button-clicked", "파일을 읽을 수 없습니다.");
                return;
            }
            socket.emit("button-clicked", data);
        });
    });
});
