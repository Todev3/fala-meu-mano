import http from "http";
import { Socket, Server as SocketServer } from "socket.io";
import { IIncomeMessage } from "./interfaces";
import { memoryMsg, onlineClients } from "./memoryDb";
import {
  addMsgToBuffer,
  connectClient,
  createOutcomeMessage,
  disconnectClient,
  emitClientsEvent,
  emitEvent,
  getOnlineClientsDTO,
  sendMsgBuffer,
} from "./utils";
import Express from "express";

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

  connectClient(clientName, socketId, onlineClients);

  emitClientsEvent(io, getOnlineClientsDTO([...onlineClients]));

  sendMsgBuffer(io, clientName, socketId, memoryMsg);

  socket.on("message", (data: string) => {
    try {
      const { receiver, msg } = JSON.parse(data) as IIncomeMessage;

      const out = createOutcomeMessage(clientName, msg);

      const onlineReceiver = onlineClients.get(receiver);

      addMsgToBuffer(receiver, out, memoryMsg);

      if (onlineReceiver?.online) {
        sendMsgBuffer(io, clientName, socketId, memoryMsg);
      }
    } catch (error) {
      console.log("error", error);
    }
  });

  socket.on("disconnect", () => {
    disconnectClient(clientName, onlineClients);

    emitEvent(io, "clients", getOnlineClientsDTO([...onlineClients]));

    console.log("Disconnect ->", socketId);
  });
});

server.listen(3000, () => {
  console.log("listening on -> 3000");
});
