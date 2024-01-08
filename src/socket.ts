import { type Socket, Server as SocketServer } from "socket.io";
import { type IIncomeMessage } from "./interface/Message";
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
import { type HistoryRequest } from "./interface/History";
import { messageRepository } from "./repository/MessageRepository";
import { type Server } from "http";
import { logger } from "./logger";
import { userRepository } from "./repository/UserRepository";
import { sessionMemoryDb } from "./data/SessionMemoryDb";
import { bufferMemoryDb } from "./data/BufferMemoryDb";

export const connectSocket = (server: Server): void => {
  const socketServer = new SocketServer(server);

  socketServer.on("connection", async (socket: Socket) => {
    const userName = socket.handshake.headers.id ?? "default";
    const socketId = socket.id;

    if (Array.isArray(userName)) {
      emitErrorEventBySocketId(
        socketServer,
        socketId,
        `id is not valid -> ${JSON.stringify(userName)}`,
      );
      return;
    }

    logger.info(`Connect id -> ${socketId} <> ${userName}`);

    const user = await getOrCreateUser(userName, userRepository);
    const onlineUser = connectUser(user, socketId, sessionMemoryDb);

    emitUsersEvent(socketServer, getOnlineUsersDTO(sessionMemoryDb.toArray()));
    sendMsgBuffer(socketServer, onlineUser, bufferMemoryDb);

    socket.on("message", async (data: string) => {
      try {
        const { receiverId, msg } = JSON.parse(data) as IIncomeMessage;

        const onlineReceiver = sessionMemoryDb.get(receiverId);

        if (!onlineReceiver) {
          emitErrorEventBySocketId(
            socketServer,
            socketId,
            `User ${receiverId} not found`,
          );
          return;
        }

        const message = createMessage(user.id, onlineReceiver.id, msg);
        const out = createOutcomeMessage(user.id, msg, message.dtRecieved);

        await persistMessage(message, messageRepository);

        addMsgToBuffer(receiverId, out, bufferMemoryDb);
        sendMsgBuffer(socketServer, onlineReceiver, bufferMemoryDb);
      } catch (error: any) {
        emitErrorEventBySocketId(socketServer, socketId, error.message);
      }
    });

    socket.on("disconnect", () => {
      disconnectUser(user, sessionMemoryDb);

      emitUsersEvent(
        socketServer,
        getOnlineUsersDTO(sessionMemoryDb.toArray()),
      );

      logger.info("Disconnect ->", socketId);
    });

    socket.on("history", async (data: string) => {
      const { receiverId, size } = JSON.parse(data) as HistoryRequest;

      const messages = await getMessageHistory(
        user.id,
        receiverId,
        messageRepository,
        size ?? 50,
      );

      const outcomeMessages = messages.map((message) => {
        return createOutcomeMessage(
          message.sender,
          message.data,
          message.dtRecieved,
        );
      });

      emitHistoryEventBySocketId(socketServer, socketId, outcomeMessages);
    });
  });
};
