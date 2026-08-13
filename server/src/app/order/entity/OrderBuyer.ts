import {Entity, Column, BaseEntity, OneToOne, PrimaryGeneratedColumn, JoinColumn} from "typeorm";
import Orders from "./Orders";
@Entity()
export default class OrderBuyer extends BaseEntity {
  @PrimaryGeneratedColumn({type: "bigint"})
  id: number;

  @Column({length: 36})
  orderid: string;

  @Column({length: 40})
  buyername: string;

  @Column({length: 40})
  email: string;

  @Column({length: 20})
  phone: string;

  @OneToOne(() => Orders)
  @JoinColumn({name: "orderid"})
  orders: Orders;
}
