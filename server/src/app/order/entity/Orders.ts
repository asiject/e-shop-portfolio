import {Entity, BaseEntity, Column, OneToOne, PrimaryColumn, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn} from "typeorm";
import OrderBuyer from "./OrderBuyer";
import OrderDelivery from "./OrderDelivery";
import OrderPayment from "./OrderPayment";
import OrderProduct from "./OrderProduct";
@Entity()
export default class Orders extends BaseEntity {
  @PrimaryColumn({length: 36})
  orderid: string;

  @Column({length: 100})
  userid: string;

  @Column({length: 40})
  status: string;

  @OneToMany(() => OrderProduct, product => product.orders)
  products: OrderProduct[];

  @OneToOne(() => OrderBuyer)
  @JoinColumn()
  buyer: OrderBuyer;

  @OneToOne(() => OrderDelivery)
  @JoinColumn()
  delivery: OrderDelivery;

  @OneToOne(() => OrderPayment)
  @JoinColumn()
  payment: OrderPayment;

  @CreateDateColumn()
  createdate: Date;
  @UpdateDateColumn()
  updatedate: Date;
}
