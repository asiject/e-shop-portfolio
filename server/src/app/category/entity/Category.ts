import {Entity, Column, BaseEntity, PrimaryGeneratedColumn, OneToMany} from "typeorm";
import CategoryProduct from "./CategoryProduct";
@Entity()
export default class Category extends BaseEntity {
  @PrimaryGeneratedColumn({type: "bigint"})
  id: number;

  @Column({length: 100})
  title: string;

  @Column({length: 20})
  type: string;

  @Column({length: 100, nullable: true})
  link: string;

  @Column({type: "bigint"})
  sortno: number;

  @Column({length: 1, default: "Y"})
  useyn: string;

  @OneToMany(() => CategoryProduct, product => product.category)
  products: CategoryProduct[];
}
