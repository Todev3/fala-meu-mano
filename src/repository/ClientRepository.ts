import { Repository } from "typeorm";
import { Client } from "../entity/Client";
import { getDataSource } from "../typeorm";

export class ClientRepository {
  public constructor(private readonly repository: Repository<Client>) {}

  public async save(model: Client): Promise<Client> {
    return await this.repository.save(model);
  }

  public async findByName(name: string): Promise<Client | null> {
    return await this.repository.findOne({ where: { name } });
  }
}

export const clientRepository = new ClientRepository(
  getDataSource().getRepository(Client)
);
