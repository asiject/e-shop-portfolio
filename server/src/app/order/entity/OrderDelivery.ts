import {Entity, Column, BaseEntity, PrimaryColumn, OneToOne, PrimaryGeneratedColumn, JoinColumn} from "typeorm";
import Orders from "./Orders";
@Entity()
export default class OrderDelivery extends BaseEntity {
  @PrimaryGeneratedColumn({type: "bigint"})
  id: number;

  @Column({length: 40})
  receiver: string;

  @Column({length: 10})
  postcode: string;

  @Column({length: 100})
  address1: string;

  @Column({length: 100})
  address2: string;

  @Column({length: 100})
  email: string;

  @Column({length: 20})
  phone: string;

  @Column({length: 100})
  description: string;

  @OneToOne(type => Orders)
  @JoinColumn({name: "orderid"})
  orders: Orders;
}
