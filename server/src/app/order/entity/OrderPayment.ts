import {Entity, Column, BaseEntity, OneToOne, PrimaryGeneratedColumn, JoinColumn} from "typeorm";
import Orders from "./Orders";
@Entity()
export default class OrderPayment extends BaseEntity {
  @PrimaryGeneratedColumn({type: "bigint"})
  id: number;

  @Column({length: 36})
  orderid: string;

  @Column({length: 20})
  type: string;

  @Column({type: "bigint"})
  price: number;

  @Column({type: "bigint"})
  charge: number;

  @Column({type: "bigint"})
  total: number;

  @OneToOne(type => Orders)
  @JoinColumn({name: "orderid"})
  orders: Orders;
}
