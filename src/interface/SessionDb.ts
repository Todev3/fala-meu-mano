import { IOnlineUser } from "./OnlineUser";

export interface SessionDbInterface {
  get: (key: number) => IOnlineUser | undefined;
  set: (key: number, user: IOnlineUser) => void;
  toArray: () => Array<[number, IOnlineUser]>;
}
