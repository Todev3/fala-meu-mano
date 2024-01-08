import { type UserEntity } from "../entity/UserEntity";
import { type IOnlineUser, type IOnlineUserDTO } from "../interface/OnlineUser";
import { type SessionDbInterface } from "../interface/SessionDb";

export const initOnlineUsers = (
  users: UserEntity[],
  onlineUsers: SessionDbInterface,
): void => {
  users.forEach((user) => {
    onlineUsers.set(user.id, {
      id: user.id,
      name: user.name,
      online: false,
      lastLogin: null,
      socketId: "",
    });
  });
};

export const disconnectUser = (
  user: UserEntity,
  onlineUsers: SessionDbInterface,
): void => {
  const onlineUser = onlineUsers.get(user.id);

  if (!onlineUser) return;

  onlineUser.online = false;
  onlineUser.lastLogin = new Date();
  onlineUser.socketId = "";
};

export const connectUser = (
  user: UserEntity,
  socketId: string,
  onlineUsers: SessionDbInterface,
): IOnlineUser => {
  const onlineUser: IOnlineUser = {
    id: user.id,
    name: user.name,
    socketId,
    lastLogin: new Date(),
    online: true,
  };

  onlineUsers.set(user.id, onlineUser);

  return onlineUser;
};

export const getOnlineUsersDTO = (
  onlineUser: Array<[number, IOnlineUser]>,
): IOnlineUserDTO[] => {
  return onlineUser.map(([key, value]) => {
    return {
      id: key,
      name: value.name,
      online: value.online,
      lastLogin: value.lastLogin,
    };
  });
};
