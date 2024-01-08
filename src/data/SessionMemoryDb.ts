import { type IOnlineUser } from "../interface/OnlineUser";
import { type SessionDbInterface } from "../interface/SessionDb";

export class SessionMemoryDb implements SessionDbInterface {
  private readonly db: Map<number, IOnlineUser>;

  constructor() {
    this.db = new Map<number, IOnlineUser>();
  }

  public get(key: number): IOnlineUser | undefined {
    return this.db.get(key);
  }

  public set(key: number, user: IOnlineUser): void {
    this.db.set(key, user);
  }

  public toArray(): Array<[number, IOnlineUser]> {
    return [...this.db];
  }
}

export const sessionMemoryDb = new SessionMemoryDb();
