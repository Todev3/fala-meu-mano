import { UserEntity } from "../entity/UserEntity";
import { IOnlineUser, IOnlineUserDTO } from "../interface/OnlineUserInterface";
import { SessionDb } from "../interface/SessionDb";

export const initOnlineUsers = (
  users: UserEntity[],
  onlineUsers: SessionDb
): void => {
  users.forEach((user) => {
    onlineUsers.set(user.name, {
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
  const onlineUser = onlineUsers.get(user.name);

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

  onlineUsers.set(user.name, onlineUser);

  return onlineUser;
};

export const getOnlineUsersDTO = (
  onlineUser: Array<[string, IOnlineUser]>
): IOnlineUserDTO[] => {
  return onlineUser.map(([key, value]) => {
    return {
      name: key,
      online: value.online,
      lastLogin: value.lastLogin,
      socketId: "",
    };
  });
};
