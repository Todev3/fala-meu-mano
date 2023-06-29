import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Client } from "./Client";

@Entity("message")
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  data: string;

  @Column()
  @ManyToOne(() => Client)
  @JoinColumn({ name: "receiver" })
  receiver: number;

  @Column()
  @ManyToOne(() => Client)
  @JoinColumn({ name: "sender" })
  sender: number;

  @Column()
  dtRecieved: Date;
}
