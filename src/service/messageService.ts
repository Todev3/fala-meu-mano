import { MessageEntity } from "../entity/MessageEntity";
import { MessageRepository } from "../repository/MessageRepository";

export const persistMessage = async (
  message: MessageEntity,
  repository: MessageRepository
): Promise<void> => {
  await repository.save(message);
};

export const createMessage = (
  sender: number,
  receiver: number,
  msg: string
): MessageEntity => {
  const message = new MessageEntity();

  message.sender = sender;
  message.receiver = receiver;
  message.data = msg;
  message.dtRecieved = new Date();

  return message;
};
