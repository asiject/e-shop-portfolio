import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";
@Entity()
export default class DiscountPolicy extends BaseEntity {
  @PrimaryGeneratedColumn({type: "bigint"})
  id: number;

  @Column({length: 40})
  type: string;

  @Column({type: "bigint"})
  value: number;

  @Column({length: 1})
  useyn: string;
}
