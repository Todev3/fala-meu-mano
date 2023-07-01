import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Unique(["name"])
  @Column()
  name: string;
}
