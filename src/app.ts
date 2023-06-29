import http from "http";
import { Socket, Server as SocketServer } from "socket.io";
import { IIncomeMessage } from "./interface/interfaces";
import { memoryMsg, onlineClients } from "./data/memoryDb";
import {
  addMsgToBuffer,
  createOutcomeMessage,
  emitClientsEvent,
  emitEvent,
  emitEventBySocketId,
  sendMsgBuffer,
} from "./utils/messageUtil";
import Express from "express";
import { startConnection } from "./typeorm";
import { clientRepository } from "./repository/ClientRepository";
import { Client } from "./entity/Client";
import {
  connectClient,
  disconnectClient,
  getOnlineClientsDTO,
  initOnlineClients,
} from "./utils/onlineClientUtil";

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

  let client = await clientRepository.findByName(clientName);

  if (!client) {
    client = new Client();
    client.name = clientName;
    client = await clientRepository.save(client);
  }

  const onlineClient = connectClient(client, socketId, onlineClients);

  emitClientsEvent(io, getOnlineClientsDTO([...onlineClients]));

  sendMsgBuffer(io, onlineClient, memoryMsg);

  socket.on("message", async (data: string) => {
    try {
      const { receiver, msg } = JSON.parse(data) as IIncomeMessage;

      const out = createOutcomeMessage(clientName, msg);

      const client = await clientRepository.findByName(receiver);

      if (!client) {
        emitEventBySocketId<string>(io, socketId, "error", [
          `Client ${receiver} not found`,
        ]);
        return;
      }

      const onlineReceiver = onlineClients.get(receiver);

      addMsgToBuffer(receiver, out, memoryMsg);

      if (onlineReceiver?.online) {
        sendMsgBuffer(io, onlineReceiver, memoryMsg);
      }
    } catch (error) {
      console.log("error", error);
    }
  });

  socket.on("disconnect", () => {
    if (client) disconnectClient(client, onlineClients);

    emitEvent(io, "clients", getOnlineClientsDTO([...onlineClients]));

    console.log("Disconnect ->", socketId);
  });
});

initOnlineClients([], onlineClients);

startConnection().catch((error: any) => {
  console.log("Error on start connection", error);
});

server.listen(3000, () => {
  console.log("listening on -> 3000");
});
