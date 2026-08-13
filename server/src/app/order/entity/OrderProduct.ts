import Product from "@product/entity/Product";
import {Entity, Column, BaseEntity, OneToOne, PrimaryGeneratedColumn, JoinColumn, ManyToMany, ManyToOne} from "typeorm";
import Orders from "./Orders";
@Entity()
export default class OrderProduct extends BaseEntity {
  @PrimaryGeneratedColumn({type: "bigint"})
  id: number;

  @Column({type: "bigint"})
  productid: number;

  @Column({type: "bigint"})
  itemid: number;

  @Column({length: 100})
  option: string;

  @Column({type: "bigint"})
  count: number;

  @Column({type: "bigint"})
  cost: number;

  @Column({length: 36})
  orderid: string;

  @ManyToOne(() => Orders, orders => orders.products)
  @JoinColumn({name: "orderid"})
  orders: Orders;

  @ManyToOne(() => Product, product => product.id)
  @JoinColumn({name: "productid"})
  product: Product;
}
