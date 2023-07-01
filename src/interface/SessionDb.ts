import { IOnlineUser } from "./OnlineUserInterface";

export interface SessionDb {
  get: (key: string) => IOnlineUser | undefined;
  set: (key: string, user: IOnlineUser) => void;
  toArray: () => Array<[string, IOnlineUser]>;
}
