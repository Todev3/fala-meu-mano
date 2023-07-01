import http from "http";
import { Socket, Server as SocketServer } from "socket.io";
import { IIncomeMessage } from "./interface/interfaces";
import { memoryMsg, onlineUsers } from "./data/memoryDb";
import {
  addMsgToBuffer,
  createOutcomeMessage,
  emitUsersEvent,
  emitEvent,
  emitEventBySocketId,
  sendMsgBuffer,
} from "./utils/messageUtil";
import Express from "express";
import { startConnection } from "./typeorm";
import { userRepository } from "./repository/UserRepository";
import {
  connectUser,
  disconnectUser,
  getOnlineUsersDTO,
  initOnlineUsers,
} from "./utils/onlineUserUtil";
import { Message } from "./entity/Message";
import { getOrCreateUser } from "./utils/userUtil";

export const app = Express();

app.get("/", (_, res) => {
  res.send("Hello World!");
});

const server = http.createServer(app);
const io = new SocketServer(server);

io.on("connection", async (socket: Socket) => {
  const clientName = socket.handshake.headers.id ?? "default";
  const socketId = socket.id;

  console.log("Connect id ->", socketId, clientName);

  if (!clientName || Array.isArray(clientName)) {
    console.log("id is not valid ->", clientName);
    return;
  }

  const client = await getOrCreateUser(clientName, userRepository);

  const onlineUser = connectUser(client, socketId, onlineUsers);

  emitUsersEvent(io, getOnlineUsersDTO([...onlineUsers]));

  sendMsgBuffer(io, onlineUser, memoryMsg);

  socket.on("message", async (data: string) => {
    try {
      const { receiver, msg } = JSON.parse(data) as IIncomeMessage;

      const out = createOutcomeMessage(clientName, msg);

      const receiverUser = await userRepository.findByName(receiver);
      const onlineReceiver = onlineUsers.get(receiver);

      if (!receiverUser || !onlineReceiver) {
        emitEventBySocketId<string>(io, socketId, "error", [
          `User ${receiver} not found`,
        ]);
        return;
      }

      const message = new Message();

      message.receiver = onlineReceiver.id;
      message.sender = client.id;
      message.data = msg;
      message.dtRecieved = new Date();

      addMsgToBuffer(receiver, out, memoryMsg);

      if (onlineReceiver.online) {
        sendMsgBuffer(io, onlineReceiver, memoryMsg);
      }
    } catch (error) {
      console.log("error", error);
    }
  });

  socket.on("disconnect", () => {
    if (client) disconnectUser(client, onlineUsers);

    emitEvent(io, "clients", getOnlineUsersDTO([...onlineUsers]));

    console.log("Disconnect ->", socketId);
  });
});

startConnection()
  .then(async () => {
    console.log("Database connected");

    const allUsers = await userRepository.findAll();
    initOnlineUsers(allUsers, onlineUsers);

    return null;
  })
  .catch((error: any) => {
    console.log("Error on start connection", error);
  });

server.listen(3000, "0.0.0.0", () => {
  console.log("listening on -> 3000");
});
