import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity("message")
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  data: string;

  @Column()
  @ManyToOne(() => User)
  @JoinColumn({ name: "receiver" })
  receiver: number;

  @Column()
  @ManyToOne(() => User)
  @JoinColumn({ name: "sender" })
  sender: number;

  @Column()
  dtRecieved: Date;
}
