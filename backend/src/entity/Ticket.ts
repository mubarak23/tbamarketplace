import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import TicketStatuses from "../enums/Statuses";
import TableColumns, { TicketColumns } from "../enums/TableColumns";
import Tables from "../enums/Tables";
import { ICloudFile } from "../interfaces/ICloudFile";
import { SimpleImageJson } from "../interfaces/SimpleImageJson";
import { utcNow } from "../utils/core";
import DefualtEntity from "./BaseEntity";
import { User } from "./User";


@Entity({ name: Tables.TICKETS })
export class Ticket extends DefualtEntity {
  @Column({ name: TicketColumns.UUID, unique: true })
  uuid: string;

  @Column({ name: TicketColumns.NAME, nullable: true })
  name: string;

  @Column({ name: TicketColumns.DESCRIPTION, nullable: true})
  description: string;

  @Column({ name: TicketColumns.CUSTOMER_EMAIL, nullable: true})
  customerEmail: string;

  @Column({ name: TicketColumns.USER_ID, nullable: false})
  userId: number;

  @ManyToOne(() => User, { primary: true }) // User can have many tickets assign to him
  @JoinColumn({
    name: TicketColumns.USER_ID,
    referencedColumnName: TableColumns.ID,
  })
  user: User;


  @Column({ type:"jsonb", name: TicketColumns.IMAGES, nullable: true})
  images: SimpleImageJson[]

  @Column({ name: TicketColumns.STATUS, default: TicketStatuses.CREATED})
  status: TicketStatuses;

  

  initialize(name: string, description: string, userId: number, customerEmail: string){
    const now = utcNow();
    this.uuid = uuidv4();
    this.name = name;
    this.description = description;
    this.customerEmail = customerEmail;
    this.userId = userId;
    this.createdAt = now;
    return this
  }
}