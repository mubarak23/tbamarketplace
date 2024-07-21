import { Entity, Column } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { utcNow } from "../utils/core";
import TableColumns, { UserColumns } from "../enums/TableColumns";
import Tables from "../enums/Tables";
import DefualtEntity from "./BaseEntity";
import { Roles } from "../enums/Roles";
import { ICloudFile } from "../interfaces/ICloudFile";

@Entity({ name: Tables.USERS })
export class User extends DefualtEntity {
  @Column({ name: UserColumns.UUID, unique: true })
  uuid: string;

  @Column({ length: 255, name: UserColumns.FIRST_NAME, nullable: false })
  firstName!: string;

  @Column({ length: 255, name: UserColumns.LAST_NAME, nullable: false })
  lastName!: string;

  @Column({ name: UserColumns.EMAIL_ADDRESS, nullable: true })
  emailAddress!: string;

  @Column({ name: UserColumns.PHONE_NUMBER, nullable: false })
  phoneNumber!: string;


  @Column({ name: UserColumns.PASSWORD_HASH, nullable: false })
  passwordHash: string;

  @Column({ type: "jsonb", name: UserColumns.PHOTO, nullable: true })
  photo: ICloudFile;

  @Column({ name: UserColumns.ROLE, nullable: false, default: Roles.NORMAL_USER })
  role!: string;


  initialize(firstName: string, lastName: string, emailAddress: string, phoneNumber: string, passwordHash: string) {
    this.uuid = uuidv4();

    const now = utcNow();
    this.firstName = firstName;
    this.lastName = lastName;
    this.emailAddress = emailAddress;
    this.phoneNumber = phoneNumber;
    this.passwordHash = passwordHash;
    this.createdAt = now;
    return this;
  }

}
