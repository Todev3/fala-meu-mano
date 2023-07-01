import { User } from "../entity/User";
import { IOnlineUser, IOnlineUserDTO } from "../interface/interfaces";

export const initOnlineUsers = (
  users: User[],
  onlineUsers: Map<string, IOnlineUser>
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
  user: User,
  onlineUsers: Map<string, any>
): void => {
  const onlineUser = onlineUsers.get(user.name);

  onlineUser.online = false;
  onlineUser.lastDate = new Date();
  onlineUser.socketId = null;
};

export const connectUser = (
  user: User,
  socketId: string,
  onlineUsers: Map<string, IOnlineUser>
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

export const getOnlineUsersDTO = (onlineUser: any[]): IOnlineUserDTO[] => {
  return onlineUser.map(([key, value]) => {
    return {
      name: key,
      online: value.online,
      lastLogin: value.lastLogin,
      socketId: "",
    };
  });
};
