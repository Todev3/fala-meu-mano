import http from "http";
import { Socket, Server as SocketServer } from "socket.io";
import { memoryMsg } from "./data/memoryDb";
import { sessionMemoryDb as onlineUsers } from "./data/SessionMemoryDb";
import {
  addMsgToBuffer,
  createOutcomeMessage,
  emitUsersEvent,
  sendMsgBuffer,
  emitErrorEventBySocketId,
  emitHistoryEventBySocketId,
} from "./service/eventService";
import Express from "express";
import { startConnection } from "./typeorm";
import { userRepository } from "./repository/UserRepository";
import {
  connectUser,
  disconnectUser,
  getOnlineUsersDTO,
  initOnlineUsers,
} from "./service/onlineUserService";
import { getOrCreateUser } from "./service/userService";
import { messageRepository } from "./repository/MessageRepository";
import { createMessage, persistMessage } from "./service/messageService";
import { IIncomeMessage } from "./interface/Message";
import { HistoryRequest } from "./interface/History";

export const app = Express();
app.use(Express.static("public"));

const server = http.createServer(app);
const io = new SocketServer(server);

io.on("connection", async (socket: Socket) => {
  const userName = socket.handshake.headers.id ?? "default";
  const socketId = socket.id;

  console.log("Connect id ->", socketId, userName);

  if (Array.isArray(userName)) {
    emitErrorEventBySocketId(
      io,
      socketId,
      `id is not valid -> ${JSON.stringify(userName)}`
    );
    return;
  }

  const user = await getOrCreateUser(userName, userRepository);
  const onlineUser = connectUser(user, socketId, onlineUsers);

  emitUsersEvent(io, getOnlineUsersDTO(onlineUsers.toArray()));
  sendMsgBuffer(io, onlineUser, memoryMsg);

  socket.on("message", async (data: string) => {
    try {
      const { receiverId, msg } = JSON.parse(data) as IIncomeMessage;

      const onlineReceiver = onlineUsers.get(receiverId);

      if (!onlineReceiver) {
        emitErrorEventBySocketId(io, socketId, `User ${receiverId} not found`);
        return;
      }

      const message = createMessage(user.id, onlineReceiver.id, msg);
      const out = createOutcomeMessage(user.id, msg, message.dtRecieved);

      await persistMessage(message, messageRepository);

      addMsgToBuffer(receiverId, out, memoryMsg);
      sendMsgBuffer(io, onlineReceiver, memoryMsg);
    } catch (error: any) {
      emitErrorEventBySocketId(io, socketId, error.message);
    }
  });

  socket.on("disconnect", () => {
    disconnectUser(user, onlineUsers);

    emitUsersEvent(io, getOnlineUsersDTO(onlineUsers.toArray()));

    console.log("Disconnect ->", socketId);
  });

  socket.on("history", async (data: string) => {
    const { receiverId, size } = JSON.parse(data) as HistoryRequest;

    const messages = await messageRepository.findBySenderAndReceiver(
      user.id,
      receiverId,
      size ?? 50
    );

    const outcomeMessages = messages.map((message) => {
      return createOutcomeMessage(user.id, message.data, message.dtRecieved);
    });

    emitHistoryEventBySocketId(io, socketId, outcomeMessages);
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
