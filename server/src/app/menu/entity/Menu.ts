import {Entity, Column, BaseEntity, PrimaryGeneratedColumn, OneToMany, CreateDateColumn} from "typeorm";
@Entity()
export default class Menu extends BaseEntity {
  @PrimaryGeneratedColumn({type: "bigint"})
  id: number;

  @Column({length: 100})
  title: string;

  @Column({length: 20})
  url: string;

  @Column({length: 1, default: "Y"})
  useyn: string;

  @Column({type: "bigint", nullable: true})
  sortno: number;

  @CreateDateColumn()
  createdate: Date;
}
