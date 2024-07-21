// import { Column, Entity } from 'typeorm';
// import { v4 as uuidv4 } from 'uuid';
// import { SelectedBidColumns } from '../enums/TableColumns';
// import Tables from '../enums/Tables';
// import { utcNow } from '../utils/core';
// import DefualtEntity from './BaseEntity';

// @Entity({ name: Tables.SELECTED_BID })
// export class SelectedBid extends DefualtEntity {
//   @Column({ name: SelectedBidColumns.UUID, unique: true })
//   uuid: string;

//   @Column({ name: SelectedBidColumns.NFT_ADDRESS, nullable: true })
//   nftAddress: string;

//   @Column({ name: SelectedBidColumns.BUYER_ADDRESS, nullable: true })
//   buyerAddress: string;

//   @Column({ name: SelectedBidColumns.SELLER_ADDRESS, nullable: true })
//   sellerAddress: string;

//   @Column({ name: SelectedBidColumns.BID_ID, nullable: true })
//   bidId: number;

//   @Column({ name: SelectedBidColumns.AMOUNT, nullable: true })
//   amount: number;

//   @Column({
//     name: SelectedBidColumns.RECIPIENT_TRANSACTION_REFERNCE,
//     nullable: true,
//   })
//   recipientTransactionReference: string;

//   initialize(
//     buyerAddress: string,
//     sellerAddress: string,
//     bidId: number,
//     amount: number,
//     nftAddress: string
//   ) {
//     const now = utcNow();
//     this.uuid = uuidv4();
//     this.bidId = bidId;
//     this.buyerAddress = buyerAddress;
//     this.sellerAddress = sellerAddress;
//     this.amount = amount;
//     this.nftAddress = nftAddress;
//     this.createdAt = now;
//     return this;
//   }
// }
