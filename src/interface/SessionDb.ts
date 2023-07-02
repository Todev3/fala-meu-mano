import { IOnlineUser } from "./OnlineUser";

export interface SessionDb {
  get: (key: number) => IOnlineUser | undefined;
  set: (key: number, user: IOnlineUser) => void;
  toArray: () => Array<[number, IOnlineUser]>;
}
