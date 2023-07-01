import { IOnlineUser, IOutcomeMessage } from "../interface/interfaces";

export const onlineUsers = new Map<string, IOnlineUser>();
export const memoryMsg = new Map<string, IOutcomeMessage[]>();
