import { Column, Entity } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { SellerNftColumns } from '../enums/TableColumns';
import Tables from '../enums/Tables';
import { utcNow } from '../utils/core';
import DefualtEntity from './BaseEntity';

@Entity({ name: Tables.SELECTED_BID })
export class SellerNft extends DefualtEntity {
  @Column({ name: SellerNftColumns.UUID, unique: true })
  uuid: string;

  @Column({ name: SellerNftColumns.NFT_ADDRESS, nullable: true })
  nftAddress: string;

  @Column({ name: SellerNftColumns.SELLER_ADDRESS, nullable: true })
  sellerAddress: string;

  @Column({ name: SellerNftColumns.BID_ID, nullable: true })
  bidId: number;

  @Column({ name: SellerNftColumns.IS_CLOSED, nullable: true, default: false })
  isClosed: boolean;

  initialize(sellerAddress: string, bidId: number, nftAddress: string) {
    const now = utcNow();
    this.uuid = uuidv4();
    this.bidId = bidId;
    this.sellerAddress = sellerAddress;
    this.nftAddress = nftAddress;
    this.isClosed = false;
    this.createdAt = now;
    return this;
  }
}
