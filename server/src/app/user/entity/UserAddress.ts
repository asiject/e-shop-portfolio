import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";
@Entity()
export default class UserAddress extends BaseEntity {
  @PrimaryGeneratedColumn({type: "bigint"})
  id: number;

  @Column({length: 100})
  userid: string;

  @Column({length: 40})
  alias: string;

  @Column({length: 40})
  postcode: string;

  @Column({length: 100})
  address1: string;

  @Column({length: 100})
  address2: string;

  @Column({length: 20})
  phone: string;
}
