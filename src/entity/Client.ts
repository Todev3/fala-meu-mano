import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity("client")
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Unique(["name"])
  @Column()
  name: string;
}
