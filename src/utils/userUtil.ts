import { User } from "../entity/User";
import { UserRepository } from "../repository/UserRepository";

export const getOrCreateUser = async (
  clientName: string,
  repository: UserRepository
): Promise<User> => {
  const client = await repository.findByName(clientName);

  if (!client) {
    const model = new User();
    model.name = clientName;
    return await repository.save(model);
  }

  return client;
};
