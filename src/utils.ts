import { Server } from "socket.io";
import { IOnlineClient, IOnlineClientDTO, IOutcomeMessage } from "./interfaces";

export const getOnlineClientsDTO = (
  onlineClients: any[]
): IOnlineClientDTO[] => {
  return onlineClients.map(([key, value]) => {
    return {
      name: key,
      online: value.online,
      lastLogin: value.lastLogin,
      socketId: "",
    };
  });
};

export const sendMsgBuffer = (
  io: Server,
  clientName: string,
  socketId: string,
  memoryMsg: Map<string, IOutcomeMessage[]>
): boolean => {
  const msgBuffer = memoryMsg.get(clientName) ?? [];
  const size = msgBuffer.length;

  if (size) {
    const sendMsgs = msgBuffer.splice(0, size);
    emitMsgEventBySocketId(io, socketId, sendMsgs);
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

export const emitClientsEvent = (
  io: Server,
  clients: IOnlineClientDTO[]
): void => {
  emitEvent<IOnlineClientDTO>(io, "clients", clients);
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

export const disconnectClient = (
  clientName: string,
  onlineClients: Map<string, any>
): void => {
  const client = onlineClients.get(clientName);

  client.online = false;
  client.lastDate = new Date();
  client.socketId = null;
};

export const connectClient = (
  clientName: string,
  socketId: string,
  onlineClients: Map<string, IOnlineClient>
): void => {
  onlineClients.set(clientName, {
    socketId,
    lastLogin: new Date(),
    online: true,
  });
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
