export interface IIncomeMessage {
  receiver: string;
  msg: string;
}

export interface IOutcomeMessage {
  sender: string;
  msg: string;
  date: Date;
}

export interface IOnlineClientDTO {
  name: string;
  online: boolean;
  lastLogin: Date;
  socketId: string;
}

export interface IOnlineClient {
  online: boolean;
  lastLogin: Date;
  socketId: string;
}
