import Product from "@product/entity/Product";
import {Entity, Column, BaseEntity, JoinColumn, PrimaryGeneratedColumn, Unique, ManyToOne} from "typeorm";

@Entity()
@Unique(["userid", "pid", "itemid", "option"])
export default class Cart extends BaseEntity {
  @PrimaryGeneratedColumn({type: "bigint"})
  id: number;

  @Column({length: 100})
  userid: string;

  @Column({type: "bigint"})
  pid: number;

  @Column({type: "bigint"})
  itemid: number;

  @Column({default: ""})
  option: string;

  @Column({type: "bigint"})
  count: number;

  @Column({type: "bigint"})
  cost: number;

  @ManyToOne(() => Product, product => product.id)
  @JoinColumn({name: "pid"})
  product: Product;
}
