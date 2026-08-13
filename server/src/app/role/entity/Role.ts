import UserRole from "@user/entity/UserRole";
import {Entity, Column, BaseEntity, PrimaryColumn, OneToMany} from "typeorm";
@Entity()
export default class Role extends BaseEntity {
  @PrimaryColumn({length: 100})
  roleid: string;

  @Column({length: 40})
  rolename: string;

  @OneToMany(() => UserRole, roles => roles.role)
  users: UserRole[];
}
