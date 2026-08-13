import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn} from "typeorm";

@Entity()
export default class FileMeta extends BaseEntity {
  @PrimaryColumn()
  fileid: string;

  @Column()
  filename: string;

  @Column()
  refid: string;

  @Column()
  filepath: string;

  @Column()
  filesize: number;

  @Column()
  filetype: string;

  @Column()
  sortno: number;

  @CreateDateColumn()
  creaetdate: Date;
}
