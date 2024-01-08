import { type Server } from "socket.io";
import { type IOutcomeMessage } from "../interface/Message";
import { type IOnlineUser, type IOnlineUserDTO } from "../interface/OnlineUser";
import { type BufferDbInterface } from "../interface/BufferDb";

export const sendMsgBuffer = (
  io: Server,
  user: IOnlineUser,
  memoryMsg: BufferDbInterface,
): boolean => {
  const msgBuffer = memoryMsg.get(user.id);
  const size = msgBuffer.length;

  if (!user.online || !size) return false;

  const sendMsgs = msgBuffer.splice(0, size);
  emitMsgEventBySocketId(io, user.socketId, sendMsgs);

  return true;
};

export const emitMsgEventBySocketId = (
  io: Server,
  socketId: string,
  msgs: IOutcomeMessage[],
): void => {
  emitEventBySocketId<IOutcomeMessage>(io, socketId, "msg", msgs);
};

export const emitErrorEventBySocketId = (
  io: Server,
  socketId: string,
  erro: string,
): void => {
  emitEventBySocketId<string>(io, socketId, "error", [erro]);
};

export const emitHistoryEventBySocketId = (
  io: Server,
  socketId: string,
  messages: IOutcomeMessage[],
): void => {
  emitEventBySocketId<IOutcomeMessage>(io, socketId, "history", messages);
};

export const emitUsersEvent = (io: Server, users: IOnlineUserDTO[]): void => {
  emitEvent<IOnlineUserDTO>(io, "users", users);
};

export const emitEventBySocketId = <T>(
  io: Server,
  socketId: string,
  event: string,
  data: T[],
): void => {
  io.to(socketId).emit(event, data);
};

export const emitEvent = <T>(io: Server, event: string, data: T[]): void => {
  io.emit(event, data);
};

export const createOutcomeMessage = (
  senderId: number,
  msg: string,
  date: Date,
): IOutcomeMessage => {
  return {
    senderId,
    msg,
    date,
  };
};

export const addMsgToBuffer = (
  receiverId: number,
  out: IOutcomeMessage,
  memoryMsg: BufferDbInterface,
): void => {
  memoryMsg.set(receiverId, out);
};
