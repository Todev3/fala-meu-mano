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

export const getMessageHistory = async (
  senderId: number,
  receiverId: number,
  Repository: MessageRepository,
  size: number = 50
): Promise<MessageEntity[]> => {
  const messages = await Repository.findBySenderAndReceiver(
    senderId,
    receiverId,
    size
  );

  const allMessages = messages.concat(
    await Repository.findBySenderAndReceiver(receiverId, senderId, size)
  );

  allMessages.sort((a: MessageEntity, b: MessageEntity) => {
    return b.dtRecieved.getTime() - a.dtRecieved.getTime();
  });

  return allMessages;
};
