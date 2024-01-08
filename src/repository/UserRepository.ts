import { type Repository } from "typeorm";
import { UserEntity } from "../entity/UserEntity";
import { getDataSource } from "../typeorm";

export class UserRepository {
  public constructor(private readonly repository: Repository<UserEntity>) {}

  public async findAll(): Promise<UserEntity[]> {
    return await this.repository.find();
  }

  public async save(model: UserEntity): Promise<UserEntity> {
    return await this.repository.save(model);
  }

  public async findByName(name: string): Promise<UserEntity | null> {
    return await this.repository.findOne({ where: { name } });
  }
}

export const userRepository = new UserRepository(
  getDataSource().getRepository(UserEntity),
);
