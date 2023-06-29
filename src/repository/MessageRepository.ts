import { Repository } from "typeorm";
import { getDataSource } from "../typeorm";
import { Message } from "../entity/Message";

export class MessageRepository {
  public constructor(private readonly repository: Repository<Message>) {}

  public async save(model: Message): Promise<Message> {
    return await this.repository.save(model);
  }
}

export const messageRepository = new MessageRepository(
  getDataSource().getRepository(Message)
);
