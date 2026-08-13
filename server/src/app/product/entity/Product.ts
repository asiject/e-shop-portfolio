import Cart from "@cart/entity/Cart";
import CategoryProduct from "@category/entity/CategoryProduct";
import OrderProduct from "@order/entity/OrderProduct";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, OneToOne, CreateDateColumn} from "typeorm";
import ProductImage from "./ProductImage";
import ProductOption from "./ProductOption";
@Entity()
export default class Product extends BaseEntity {
  @PrimaryGeneratedColumn({type: "bigint"})
  id: number;

  @Column({length: 40})
  title: string;

  @Column({length: 100})
  description: string;

  @Column({length: 100})
  thumbnail: string;

  @Column({type: "bigint"})
  cost: number;

  @Column({type: "bigint"})
  capacity: number;

  @Column({type: "bigint"})
  optionCnt: number;

  @Column({length: 1})
  showyn: string;

  @Column({type: "text", nullable: true})
  editor: string;

  @CreateDateColumn()
  createdate: Date;

  @OneToMany(() => CategoryProduct, category => category.product)
  categories: CategoryProduct[];

  @OneToMany(() => ProductOption, option => option.product)
  options: ProductOption[];

  @OneToMany(() => ProductImage, image => image.product)
  images: ProductImage[];

  @OneToOne(() => Cart)
  cart: Cart;

  @OneToOne(() => OrderProduct)
  orderProduct: OrderProduct;
}
