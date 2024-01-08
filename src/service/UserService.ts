import { UserEntity } from "../entity/UserEntity";
import { type UserRepository } from "../repository/UserRepository";

export const getOrCreateUser = async (
  userName: string,
  repository: UserRepository,
): Promise<UserEntity> => {
  const user = await repository.findByName(userName);

  if (!user) {
    const model = new UserEntity();
    model.name = userName;
    return await repository.save(model);
  }

  return user;
};
