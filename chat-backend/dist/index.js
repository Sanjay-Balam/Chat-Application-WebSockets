"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let allSockets = [];
wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        var _a;
        // {type: "join", room: "room1"} --> This message is in the string formate need to parse it into the json object
        const parsedMessage = JSON.parse(message.toString()); // convert string to json object
        if (parsedMessage.type === "join") {
            allSockets.push({ socket, room: parsedMessage.payload.roomId });
        }
        else if (parsedMessage.type === "chat") {
            // {type: "chat", payload: {roomId: "room1", message: "hello"}}
            const currentRoom = (_a = allSockets.find((user) => user.socket === socket)) === null || _a === void 0 ? void 0 : _a.room;
            if (currentRoom) {
                allSockets.filter((user) => user.room === currentRoom).forEach((user) => {
                    user.socket.send(parsedMessage.payload.message);
                });
            }
        }
    });
});
