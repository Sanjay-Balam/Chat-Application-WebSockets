import { WebSocketServer, WebSocket} from "ws";

const wss = new WebSocketServer({ port: 8080 });

// let userCount = 0;
// let allSockets: WebSocket[] = [];

// Example code for a chat server
/*
wss.on("connection", (socket) => {
    allSockets.push(socket);
    userCount++;
    console.log(`${userCount} users connected`);

    socket.on("message", (message) => {
        console.log(`message received: ${message}`);
        setTimeout(() => {
            allSockets.forEach((s) => {
                s.send(`message received: ${message}`);
            });
        }, 1000);
    });

    socket.on("close", () => {
        allSockets = allSockets.filter((s) => s !== socket);
        userCount--;
        console.log(`${userCount} users connected`);
    });
});
*/

interface User {
    socket: WebSocket;
    room: string;
}

let allSockets: User[] = [];


wss.on("connection", (socket) => {
    socket.on("message", (message)=> {
        // {type: "join", room: "room1"} --> This message is in the string formate need to parse it into the json object
        const parsedMessage = JSON.parse(message.toString()); // convert string to json object
        if(parsedMessage.type === "join") {
            allSockets.push({socket, room: parsedMessage.payload.roomId});
        }
        else if(parsedMessage.type === "chat") { 
            // {type: "chat", payload: {roomId: "room1", message: "hello"}}
            const currentRoom = allSockets.find((user) => user.socket === socket)?.room;
            if(currentRoom) {
                allSockets.filter((user) => user.room === currentRoom).forEach((user) => {
                    user.socket.send(parsedMessage.payload.message);
                });
            }
        }
    });
});