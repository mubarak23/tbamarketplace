import { Body, Get, Path, Post, Put, Query, Request, Route, Tags } from 'tsoa';
import { getRepository } from 'typeorm';
import * as _ from 'underscore';
import { IPaginatedList } from '../dto/IPaginatedList';
import { ISubmitSellerNftDto } from '../dto/NewTbaForBid';
import { SellerNft } from '../entity/SellerNftEntity';
import { SortOrder } from '../enums/SortOrder';
import { ISellerNftResponse } from '../interfaces/ISellerNftResponse';
import { IServerResponse } from '../interfaces/IServerResponse';
import * as BidService from '../services/bidService';
import * as PaginationService from '../services/paginationService';
import { NotFoundError } from '../utils/error-response-types';

// VIEW ALL SELLER NFT -- DONE
@Route('/api/sellernft')
@Tags('Seller NFT Service')
export class SellerNftsController {
  @Get('/all')
  public async handleGetAllSellerNfts(
    @Request() req: any,
    @Query('pageNumber') pageNumber: number,
    @Query('pageSize') pageSize: number,
    @Query('sortOrder') sortOrder: SortOrder
  ): Promise<IServerResponse<IPaginatedList<ISellerNftResponse[]>>> {
    const query: any = {
      isClosed: false,
    };
    const join = {};
    const categorysPage: IPaginatedList<SellerNft> =
      (await PaginationService.paginate(
        SellerNft,
        query,
        pageSize,
        pageNumber,
        sortOrder,
        undefined,
        join
      )) as IPaginatedList<SellerNft>;
    const nftsellers: SellerNft[] = categorysPage.dataset;

    const categoryRepo = getRepository(SellerNft);
    const total = await categoryRepo.count(query);

    const transformNftSeller = nftsellers.map((listedBids) => {
      return {
        uuid: listedBids.uuid,
        isClosed: listedBids.isClosed,
        sellerAddress: listedBids.sellerAddress,
        bidId: listedBids.bidId,
        nftAddress: listedBids.nftAddress,
        createdAt: listedBids.createdAt,
      };
    });

    const resData: IServerResponse<any> = {
      status: true,
      data: {
        pageNumber,
        total,
        pageSize,
        dataset: _.shuffle(transformNftSeller),
      },
    };

    return resData;
  }

  // VIEW SINGLE SELLER NFT DATA -- DONE
  @Get('/:sellernftuuid')
  public async handleSingleSellerNft(
    @Request() req: any,
    @Path('sellernftuuid') sellernftuuid: string
  ): Promise<IServerResponse<ISellerNftResponse>> {
    const sellerNftRepo = getRepository(SellerNft);
    const sellerNftForBid = await sellerNftRepo.findOne({
      uuid: sellernftuuid,
    });

    console.log('result of query -:', sellerNftForBid);
    if (!sellerNftForBid) {
      throw new NotFoundError('Seller NFT for Bid Does Not exist');
    }

    if (sellerNftForBid.isClosed == true) {
      throw new NotFoundError('Seller NFT for Bid Has Closed');
    }

    const response: ISellerNftResponse = {
      uuid: sellerNftForBid.uuid,
      isClosed: sellerNftForBid.isClosed,
      sellerAddress: sellerNftForBid.sellerAddress,
      bidId: sellerNftForBid.bidId,
      nftAddress: sellerNftForBid.nftAddress,
      createdAt: sellerNftForBid.createdAt,
    };
    const resData: IServerResponse<ISellerNftResponse> = {
      status: true,
      data: response,
    };
    return resData;
  }

  // ADD SELLER NFT
  @Post('/new')
  public async handleNewSeller(
    @Body() reqBody: ISubmitSellerNftDto
  ): Promise<IServerResponse<ISellerNftResponse>> {
    const newNftForBid = await BidService.submitSellerNftForBid(reqBody);

    const resData: IServerResponse<ISellerNftResponse> = {
      status: true,
      data: newNftForBid,
    };
    return resData;
  }

  // MARK SELLER NFT BIT as closed --

  @Put('/markasclosed/:sellernftuuid')
  public async markSellerNftAsClosed(
    @Request() req: any,
    @Path('sellernftuuid') sellernftuuid: string
  ): Promise<IServerResponse<void>> {
    const sellerNftRepo = getRepository(SellerNft);
    const sellerNftForBid = await sellerNftRepo.findOne({
      uuid: sellernftuuid,
    });

    if (!sellerNftForBid) {
      throw new NotFoundError('Seller NFT for Bid Does Not exist');
    }

    await sellerNftRepo
      .createQueryBuilder()
      .update(SellerNft)
      .set({ isClosed: true })
      .where({ id: sellerNftForBid.id })
      .execute();

    const resData: IServerResponse<void> = {
      status: true,
    };
    return resData;
  }
}
