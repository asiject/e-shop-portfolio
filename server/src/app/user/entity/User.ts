import {Entity, Column, BaseEntity, OneToMany, CreateDateColumn, PrimaryGeneratedColumn} from "typeorm";
import UserLogin from "./UserLogin";
import UserRole from "./UserRole";
@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  userid: string;

  @Column({length: 40})
  username: string;

  @Column({nullable: true})
  photo: string;

  @Column({length: 20, nullable: true})
  phone: string;

  @Column({type: "bigint", nullable: true})
  sabun: number;

  @Column({length: 400, nullable: true})
  refresh_token: string;

  @CreateDateColumn()
  createdate: Date;

  @OneToMany(() => UserRole, role => role.user)
  roles: UserRole[];

  isAdmin: boolean;

  @OneToMany(() => UserLogin, login => login.user)
  logins: UserLogin[];
  // @OneToMany(() => Orders, orders => orders)
  // orders: Orders;
}
