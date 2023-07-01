import { User } from "../entity/User";
import { UserRepository } from "../repository/UserRepository";

export const getOrCreateUser = async (
  userName: string,
  repository: UserRepository
): Promise<User> => {
  const user = await repository.findByName(userName);

  if (!user) {
    const model = new User();
    model.name = userName;
    return await repository.save(model);
  }

  return user;
};
