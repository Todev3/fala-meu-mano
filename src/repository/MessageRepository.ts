import { Repository } from "typeorm";
import { getDataSource } from "../typeorm";
import { MessageEntity } from "../entity/MessageEntity";

export class MessageRepository {
  public constructor(private readonly repository: Repository<MessageEntity>) {}

  public async save(model: MessageEntity): Promise<MessageEntity> {
    return await this.repository.save(model);
  }
}

export const messageRepository = new MessageRepository(
  getDataSource().getRepository(MessageEntity)
);
