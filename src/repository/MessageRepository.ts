import { Repository } from "typeorm";
import { getDataSource } from "../typeorm";
import { MessageEntity } from "../entity/MessageEntity";

export class MessageRepository {
  public constructor(private readonly repository: Repository<MessageEntity>) {}

  public async save(model: MessageEntity): Promise<MessageEntity> {
    return await this.repository.save(model);
  }

  public async findBySenderAndReceiver(
    senderId: number,
    receiverId: number,
    limit: number
  ): Promise<MessageEntity[]> {
    return await this.repository.find({
      where: [
        {
          sender: senderId,
          receiver: receiverId,
        },
        {
          sender: receiverId,
          receiver: senderId,
        },
      ],
      take: limit,
      order: { dtRecieved: "DESC" },
    });
  }
}

export const messageRepository = new MessageRepository(
  getDataSource().getRepository(MessageEntity)
);
