import { type IOutcomeMessage } from "./Message";

export interface BufferDbInterface {
  get: (key: number) => IOutcomeMessage[];
  set: (key: number, user: IOutcomeMessage) => void;
}
