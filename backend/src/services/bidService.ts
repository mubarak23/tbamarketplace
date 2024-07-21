// SellerNft
// API ENDPOINT
// ADD SELLER NFT -- DONE
// VIEW ALL SELLER NFT -- DONE 
// VIEW SINGLE SELLER NFT DATA -- DONE
// MARK SELLER NFT BIT as closed --  DONE

import { getFreshConnection } from '../db';
import { ISubmitSellerNftDto } from '../dto/NewTbaForBid';
import { SellerNft } from '../entity/SellerNftEntity';
import { ISellerNftResponse } from '../interfaces/ISellerNftResponse';
import * as utils from '../utils/core';

export const submitSellerNftForBid = async (
  payload: ISubmitSellerNftDto
): Promise<ISellerNftResponse> => {
  const connection = await getFreshConnection();
  const sellerNftRepo = connection.getRepository(SellerNft);

  const bidId = utils.generateUniqueNumber();

  const newSubmission: SellerNft = new SellerNft().initialize(
    payload.sellerAddress,
    bidId,
    payload.nftAddress
  );

  const saveNewSubmission = await sellerNftRepo.save(newSubmission);

  const response: ISellerNftResponse = {
    uuid: saveNewSubmission.uuid,
    isClosed: saveNewSubmission.isClosed,
    sellerAddress: saveNewSubmission.sellerAddress,
    bidId: bidId,
    nftAddress: saveNewSubmission.nftAddress,
    createdAt: saveNewSubmission.createdAt,
  };
  return response;
};
