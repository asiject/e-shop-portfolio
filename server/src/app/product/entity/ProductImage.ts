import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne} from "typeorm";
import Product from "./Product";
@Entity()
export default class ProductImage extends BaseEntity {
  @PrimaryGeneratedColumn({type: "bigint"})
  id: number;

  @Column({length: 100})
  path: string;

  @Column({type: "bigint"})
  sortno: number;

  @ManyToOne(() => Product, product => product.images)
  product: Product;
}
