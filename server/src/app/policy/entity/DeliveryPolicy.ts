import {Entity, Column, BaseEntity, PrimaryGeneratedColumn} from "typeorm";
@Entity()
export default class DeliveryPolicy extends BaseEntity {
  @PrimaryGeneratedColumn({type: "bigint"})
  id: number;

  @Column({length: 40})
  company: string;

  @Column({type: "bigint"})
  price: number;

  @Column({length: 100})
  address: string;

  @Column({type: "bigint"})
  return_price: number;

  @Column({type: "bigint"})
  change_price: number;

  @Column({type: "bigint"})
  conditions: number;
}
