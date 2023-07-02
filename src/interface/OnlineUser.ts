export interface IOnlineUserDTO {
  id: number;
  name: string;
  online: boolean;
  lastLogin: Date | null;
}

export interface IOnlineUser {
  id: number;
  name: string;
  online: boolean;
  lastLogin: Date | null;
  socketId: string;
}
