import { Repository } from "typeorm";
import { User } from "../entity/User";
import { getDataSource } from "../typeorm";

export class UserRepository {
  public constructor(private readonly repository: Repository<User>) {}

  public async findAll(): Promise<User[]> {
    return await this.repository.find();
  }

  public async save(model: User): Promise<User> {
    return await this.repository.save(model);
  }

  public async findByName(name: string): Promise<User | null> {
    return await this.repository.findOne({ where: { name } });
  }
}

export const userRepository = new UserRepository(
  getDataSource().getRepository(User)
);
