import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn} from "typeorm";
import ProductOption from "./ProductOption";
@Entity()
export default class ProductOptionItems extends BaseEntity {
  @PrimaryGeneratedColumn({type: "bigint"})
  itemid: number;

  @Column({type: "bigint"})
  productid: number;

  @Column({length: 40})
  itemkey: string;

  @Column({length: 40})
  itemval: string;

  @Column({type: "bigint"})
  price: number;

  @Column({type: "bigint"})
  capacity: number;

  @Column({length: 1})
  useyn: string;

  @ManyToOne(() => ProductOption, option => option.items)
  @JoinColumn({name: "optionid"})
  option: ProductOption;
}
