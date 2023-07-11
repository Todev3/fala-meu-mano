import { Socket, Server as SocketServer } from "socket.io";
import { IIncomeMessage } from "./interface/Message";
import {
  addMsgToBuffer,
  createOutcomeMessage,
  emitErrorEventBySocketId,
  emitHistoryEventBySocketId,
  emitUsersEvent,
  sendMsgBuffer,
} from "./service/EventService";
import {
  createMessage,
  getMessageHistory,
  persistMessage,
} from "./service/MessageService";
import {
  connectUser,
  disconnectUser,
  getOnlineUsersDTO,
} from "./service/OnlineUserService";
import { getOrCreateUser } from "./service/UserService";
import { HistoryRequest } from "./interface/History";
import { messageRepository } from "./repository/MessageRepository";
import { Server } from "http";
import { logger } from "./logger";
import { userRepository } from "./repository/UserRepository";
import { sessionMemoryDb } from "./data/SessionMemoryDb";
import { bufferMemoryDb } from "./data/BufferMemoryDb";

let io: SocketServer;

export const connectSocket = (server: Server): void => {
  io = new SocketServer(server);

  io.on("connection", async (socket: Socket) => {
    const userName = socket.handshake.headers.id ?? "default";
    const socketId = socket.id;

    if (Array.isArray(userName)) {
      emitErrorEventBySocketId(
        io,
        socketId,
        `id is not valid -> ${JSON.stringify(userName)}`
      );
      return;
    }

    logger.info(`Connect id -> ${socketId} <> ${userName}`);

    const user = await getOrCreateUser(userName, userRepository);
    const onlineUser = connectUser(user, socketId, sessionMemoryDb);

    emitUsersEvent(io, getOnlineUsersDTO(sessionMemoryDb.toArray()));
    sendMsgBuffer(io, onlineUser, bufferMemoryDb);

    socket.on("message", async (data: string) => {
      try {
        const { receiverId, msg } = JSON.parse(data) as IIncomeMessage;

        const onlineReceiver = sessionMemoryDb.get(receiverId);

        if (!onlineReceiver) {
          emitErrorEventBySocketId(
            io,
            socketId,
            `User ${receiverId} not found`
          );
          return;
        }

        const message = createMessage(user.id, onlineReceiver.id, msg);
        const out = createOutcomeMessage(user.id, msg, message.dtRecieved);

        await persistMessage(message, messageRepository);

        addMsgToBuffer(receiverId, out, bufferMemoryDb);
        sendMsgBuffer(io, onlineReceiver, bufferMemoryDb);
      } catch (error: any) {
        emitErrorEventBySocketId(io, socketId, error.message);
      }
    });

    socket.on("disconnect", () => {
      disconnectUser(user, sessionMemoryDb);

      emitUsersEvent(io, getOnlineUsersDTO(sessionMemoryDb.toArray()));

      logger.info("Disconnect ->", socketId);
    });

    socket.on("history", async (data: string) => {
      const { receiverId, size } = JSON.parse(data) as HistoryRequest;

      const messages = await getMessageHistory(
        user.id,
        receiverId,
        messageRepository,
        size ?? 50
      );

      const outcomeMessages = messages.map((message) => {
        return createOutcomeMessage(
          message.sender,
          message.data,
          message.dtRecieved
        );
      });

      emitHistoryEventBySocketId(io, socketId, outcomeMessages);
    });
  });
};
