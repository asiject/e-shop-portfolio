import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";
@Entity()
export default class UserPayment extends BaseEntity {
  @PrimaryGeneratedColumn({type: "bigint"})
  id: number;

  @Column({length: 100})
  userid: string;

  @Column({length: 40})
  alias: string;

  @Column({type: "bigint"})
  sabun: number;
}
