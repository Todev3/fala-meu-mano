import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "./UserEntity";

@Entity("message")
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  data: string;

  @Column()
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "receiver" })
  receiver: number;

  @Column()
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "sender" })
  sender: number;

  @Column()
  dtRecieved: Date;
}
