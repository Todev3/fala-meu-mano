import { IOnlineUser } from "../interface/OnlineUserInterface";
import { SessionDb } from "../interface/SessionDb";

export class SessionMemoryDb implements SessionDb {
  private readonly db: Map<string, IOnlineUser>;

  constructor() {
    this.db = new Map<string, IOnlineUser>();
  }

  public get(key: string): IOnlineUser | undefined {
    return this.db.get(key);
  }

  public set(key: string, user: IOnlineUser): void {
    this.db.set(key, user);
  }

  public toArray(): Array<[string, IOnlineUser]> {
    return [...this.db];
  }
}

export const sessionMemoryDb = new SessionMemoryDb();
