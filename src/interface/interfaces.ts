export interface IIncomeMessage {
  receiver: string;
  msg: string;
}

export interface IOutcomeMessage {
  sender: string;
  msg: string;
  date: Date;
}

export interface IOnlineUserDTO {
  name: string;
  online: boolean;
  lastLogin: Date;
  socketId: string;
}

export interface IOnlineUser {
  id: number;
  name: string;
  online: boolean;
  lastLogin: Date | null;
  socketId: string;
}
