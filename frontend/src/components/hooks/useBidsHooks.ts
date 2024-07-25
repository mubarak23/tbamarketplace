import { ABI } from "@/lib/abi";
import { CONTRACT_ADDR } from "@/lib/utils";
import { useContractRead } from "@starknet-react/core";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface BidProps {
  amount: number;
  bidder: string;
  is_active: boolean;
  bid_id: number;

}
const useBidsHooks = () => {
	const params = useParams();
	const [listingBids, setListingBids] = useState<BidProps[] | undefined>(undefined);
	const { data: bids, isLoading: bidsIsLoading } = useContractRead({
		functionName: "get_bids",
		args: [params.listing_id],
		abi: ABI,
		address: CONTRACT_ADDR,
		watch: true,
	});

  useEffect(() => {
		if (bids != null && Array.isArray(bids)) {
			let formattedBids = bids.filter(bid => bid.is_active).map((bid) => ({
				amount: bid.amount.toString(),
				bidder: bid.bidder.toString(),
        is_active: bid.is_active,
        bid_id: bid.bid_id.toString(),
			}));

			setListingBids(formattedBids);
		}
	}, [bids]);
console.log(listingBids)
	return {
    listingBids,
    bidsIsLoading
  };
}

export default useBidsHooks;
