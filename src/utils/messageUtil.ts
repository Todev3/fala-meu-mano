import { Server } from "socket.io";
import {
  IOnlineUser,
  IOnlineUserDTO,
  IOutcomeMessage,
} from "../interface/interfaces";

export const sendMsgBuffer = (
  io: Server,
  user: IOnlineUser,
  memoryMsg: Map<string, IOutcomeMessage[]>
): boolean => {
  const msgBuffer = memoryMsg.get(user.name) ?? [];
  const size = msgBuffer.length;

  if (size) {
    const sendMsgs = msgBuffer.splice(0, size);
    emitMsgEventBySocketId(io, user.socketId, sendMsgs);
  }

  return !!size;
};

export const emitMsgEventBySocketId = (
  io: Server,
  socketId: string,
  msgs: IOutcomeMessage[]
): void => {
  emitEventBySocketId<IOutcomeMessage>(io, socketId, "msg", msgs);
};

export const emitUsersEvent = (io: Server, users: IOnlineUserDTO[]): void => {
  emitEvent<IOnlineUserDTO>(io, "users", users);
};

export const emitEventBySocketId = <T>(
  io: Server,
  socketId: string,
  event: string,
  data: T[]
): void => {
  io.to(socketId).emit(event, data);
};

export const emitEvent = <T>(io: Server, event: string, data: T[]): void => {
  io.emit(event, data);
};

export const createOutcomeMessage = (
  sender: string,
  msg: string
): IOutcomeMessage => {
  return {
    sender,
    msg,
    date: new Date(),
  };
};

export const addMsgToBuffer = (
  receiver: string,
  out: IOutcomeMessage,
  memoryMsg: Map<string, IOutcomeMessage[]>
): void => {
  memoryMsg.get(receiver)?.push(out) ?? memoryMsg.set(receiver, []);
};
