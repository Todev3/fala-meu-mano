import { IOnlineClient, IOutcomeMessage } from "../interface/interfaces";

export const onlineClients = new Map<string, IOnlineClient>();
export const memoryMsg = new Map<string, IOutcomeMessage[]>();
