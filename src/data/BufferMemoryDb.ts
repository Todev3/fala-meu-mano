import { BufferDbInterface } from "../interface/BufferDb";
import { IOutcomeMessage } from "../interface/Message";

export class BufferMemoryDb implements BufferDbInterface {
  private readonly db: Map<number, IOutcomeMessage[]>;

  constructor() {
    this.db = new Map();
  }

  public get(key: number): IOutcomeMessage[] {
    return this.db.get(key) ?? [];
  }

  public set(key: number, msg: IOutcomeMessage): void {
    const buffer = this.get(key);
    this.db.set(key, [...buffer, msg]);
  }
}

export const bufferMemoryDb = new BufferMemoryDb();
