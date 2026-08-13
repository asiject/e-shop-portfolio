import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn} from "typeorm";

@Entity()
export default class FileTemp extends BaseEntity {
  @PrimaryColumn()
  fileid: string;

  @Column()
  filename: string;

  @Column()
  filepath: string;

  @Column()
  filesize: number;

  @Column()
  mimetype: string;

  @Column()
  filetype: string;

  @Column()
  sortno: number;

  @CreateDateColumn()
  createdate: Date;
}
