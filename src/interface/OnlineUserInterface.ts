export interface IOnlineUserDTO {
  name: string;
  online: boolean;
  lastLogin: Date | null;
  socketId: string;
}

export interface IOnlineUser {
  id: number;
  name: string;
  online: boolean;
  lastLogin: Date | null;
  socketId: string;
}
