export interface IIncomeMessage {
  receiver: string;
  msg: string;
}

export interface IOutcomeMessage {
  sender: string;
  msg: string;
  date: Date;
}
