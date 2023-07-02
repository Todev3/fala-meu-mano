export interface IIncomeMessage {
  receiverId: number;
  msg: string;
}

export interface IOutcomeMessage {
  senderId: number;
  msg: string;
  date: Date;
}
