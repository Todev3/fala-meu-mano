import { Client } from "../entity/Client";
import { IOnlineClient, IOnlineClientDTO } from "../interface/interfaces";

export const initOnlineClients = (
  clients: Client[],
  onlineClients: Map<string, IOnlineClient>
): void => {
  clients.forEach((client) => {
    onlineClients.set(client.name, {
      id: client.id,
      name: client.name,
      online: false,
      lastLogin: null,
      socketId: "",
    });
  });
};

export const disconnectClient = (
  client: Client,
  onlineClients: Map<string, any>
): void => {
  const onlineClient = onlineClients.get(client.name);

  onlineClient.online = false;
  onlineClient.lastDate = new Date();
  onlineClient.socketId = null;
};

export const connectClient = (
  client: Client,
  socketId: string,
  onlineClients: Map<string, IOnlineClient>
): IOnlineClient => {
  const onlineClient: IOnlineClient = {
    id: client.id,
    name: client.name,
    socketId,
    lastLogin: new Date(),
    online: true,
  };

  onlineClients.set(client.name, onlineClient);

  return onlineClient;
};

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
