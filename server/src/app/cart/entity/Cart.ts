// cart 관계....
import Product from "@product/entity/Product";
import {Entity, Column, BaseEntity, OneToMany, JoinColumn, PrimaryGeneratedColumn, Unique, Index, ManyToOne} from "typeorm";
@Entity()
//FIXME: 이거는 실제로 해봐야 정확해 질 듯?
// @Index(["userid", "pid", "itemid", "option"], {unique: true})
export default class Cart extends BaseEntity {
  @PrimaryGeneratedColumn({type: "bigint"})
  id: number;

  @Column({length: 100})
  userid: string;

  //productid
  @Column({type: "bigint"})
  pid: number;

  @Column({type: "bigint"})
  itemid: number;

  @Column()
  option: string;

  @Column({type: "bigint"})
  count: number;

  @Column({type: "bigint"})
  cost: number;

  @ManyToOne(() => Product, product => product.id)
  @JoinColumn({name: "pid"})
  product: Product;
}
