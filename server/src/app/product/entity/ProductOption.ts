import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany, JoinColumn} from "typeorm";
import Product from "./Product";
import ProductOptionItems from "./ProductOptionItems";
@Entity()
export default class ProductOption extends BaseEntity {
  @PrimaryGeneratedColumn({type: "bigint"})
  optionid: number;

  @Column({length: 40})
  optkey: string;

  @Column({length: 40})
  optvals: string;

  @ManyToOne(() => Product, product => product.options)
  @JoinColumn({name: "productid"})
  product: Product;

  @OneToMany(() => ProductOptionItems, item => item.option)
  items: ProductOptionItems[];
}
