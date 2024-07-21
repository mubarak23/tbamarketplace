// import { Column, Entity } from 'typeorm';
// import { v4 as uuidv4 } from 'uuid';
// import { PlaceBidsColumns } from '../enums/TableColumns';
// import Tables from '../enums/Tables';
// import { utcNow } from '../utils/core';
// import DefualtEntity from './BaseEntity';

// @Entity({ name: Tables.PLACE_BIDS })
// export class PlaceBids extends DefualtEntity {
//   @Column({ name: PlaceBidsColumns.UUID, unique: true })
//   uuid: string;

//   @Column({ name: PlaceBidsColumns.NFT_ADDRESS, nullable: true })
//   nftAddress: string;

//   @Column({ name: PlaceBidsColumns.BUYER_ADDRESS, nullable: true })
//   buyerAddress: string;

//   @Column({ name: PlaceBidsColumns.BID_ID, nullable: true })
//   bidId: number;

//   @Column({ name: PlaceBidsColumns.AMOUNT, nullable: true })
//   amount: number;

//   @Column({
//     name: PlaceBidsColumns.TRANSACTION_REFERNCE_FOR_AMOUNT_PLACE,
//     nullable: true,
//   })
//   transactionReferenceForAmountPlace: string;

//   initialize(
//     buyerAddress: string,
//     bidId: number,
//     amount: number,
//     nftAddress: string
//   ) {
//     const now = utcNow();
//     this.uuid = uuidv4();
//     this.bidId = bidId;
//     this.buyerAddress = buyerAddress;
//     this.amount = amount;
//     this.nftAddress = nftAddress;
//     this.createdAt = now;
//     return this;
//   }
// }
