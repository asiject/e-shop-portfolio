import Role from "@role/entity/Role";
import {Entity, BaseEntity, ManyToOne, JoinColumn, PrimaryColumn} from "typeorm";
import User from "./User";
@Entity()
export default class UserRole extends BaseEntity {
  @PrimaryColumn()
  userid: string;

  @PrimaryColumn()
  roleid: string;

  @ManyToOne(() => User, user => user.roles)
  @JoinColumn({name: "userid"})
  user: User;

  @ManyToOne(() => Role, role => role.users)
  @JoinColumn({name: "roleid"})
  role: Role;
}
