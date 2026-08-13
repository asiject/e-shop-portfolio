import {COLUMN_TYPE_ENUM, CommonYN} from "@common/CommonConstants";
import Product from "@product/entity/Product";
import {Entity, Column, BaseEntity, ManyToOne, PrimaryColumn, JoinColumn, CreateDateColumn} from "typeorm";
import Category from "./Category";
@Entity()
export default class CategoryProduct extends BaseEntity {
  @PrimaryColumn()
  categoryid: number;

  @PrimaryColumn()
  productid: number;

  @Column({type: "bigint", default: 99})
  sortno: number;

  @Column({type: COLUMN_TYPE_ENUM, enum: CommonYN, default: CommonYN.Y})
  showyn: string;

  @ManyToOne(() => Category, category => category.products)
  @JoinColumn({name: "categoryid"})
  category: Category;

  @ManyToOne(() => Product, product => product.categories)
  @JoinColumn({name: "productid"})
  product: Product;

  @CreateDateColumn()
  createdate: Date;
}
