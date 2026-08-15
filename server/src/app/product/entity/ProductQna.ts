import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, CreateDateColumn} from "typeorm";
import Product from "./Product";

export type ProductQnaKind = "question" | "exchange" | "return";

@Entity()
export default class ProductQna extends BaseEntity {
  @PrimaryGeneratedColumn({type: "bigint"})
  id: number;

  @Column({type: "bigint"})
  productid: number;

  @Column({length: 100})
  userid: string;

  @Column({length: 40, nullable: true})
  username: string;

  @Column({length: 36, nullable: true})
  orderid: string;

  @Column({length: 20})
  kind: ProductQnaKind;

  @Column({type: "text"})
  body: string;

  @Column({type: "text", nullable: true})
  answer: string;

  @CreateDateColumn()
  createdate: Date;

  @Column({type: "datetime", nullable: true})
  answeredat: Date;

  @ManyToOne(() => Product, product => product.qnas)
  @JoinColumn({name: "productid"})
  product: Product;
}
