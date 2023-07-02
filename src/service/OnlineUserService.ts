import { UserEntity } from "../entity/UserEntity";
import { IOnlineUser, IOnlineUserDTO } from "../interface/OnlineUser";
import { SessionDb } from "../interface/SessionDb";

export const initOnlineUsers = (
  users: UserEntity[],
  onlineUsers: SessionDb
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
  onlineUsers: SessionDb
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
  onlineUsers: SessionDb
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
  onlineUser: Array<[number, IOnlineUser]>
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
