import { Server } from "socket.io";
import { IOutcomeMessage } from "../interface/interfaces";
import { IOnlineUser, IOnlineUserDTO } from "../interface/OnlineUserInterface";

export const sendMsgBuffer = (
  io: Server,
  user: IOnlineUser,
  memoryMsg: Map<string, IOutcomeMessage[]>
): boolean => {
  const msgBuffer = memoryMsg.get(user.name);
  const size = msgBuffer?.length;

  if (!user.online || !size) return false;

  const sendMsgs = msgBuffer.splice(0, size);
  emitMsgEventBySocketId(io, user.socketId, sendMsgs);

  return true;
};

export const emitMsgEventBySocketId = (
  io: Server,
  socketId: string,
  msgs: IOutcomeMessage[]
): void => {
  emitEventBySocketId<IOutcomeMessage>(io, socketId, "msg", msgs);
};

export const emitErrorEventBySocketId = (
  io: Server,
  socketId: string,
  erro: string
): void => {
  emitEventBySocketId<string>(io, socketId, "error", [erro]);
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
  msg: string,
  date: Date
): IOutcomeMessage => {
  return {
    sender,
    msg,
    date,
  };
};

export const addMsgToBuffer = (
  receiver: string,
  out: IOutcomeMessage,
  memoryMsg: Map<string, IOutcomeMessage[]>
): void => {
  const buffer = memoryMsg.get(receiver) ?? [];

  memoryMsg.set(receiver, [...buffer, out]);
};
