import { ABI } from "@/lib/abi";
import { CONTRACT_ADDR } from "@/lib/utils";
import { useContractRead } from "@starknet-react/core";
import { list } from "postcss";
import React, { useEffect, useState } from "react";

interface ListingProp {
  amount: number;
  seller: string;
  nft_contract_address: string;
  listing_id: number;
  token_id: number;
}

const useListingHook = () => {
  const [listings, setListings] = useState<ListingProp[] | undefined>(undefined);

	const { data, isLoading, error } = useContractRead({
		functionName: "get_listings",
		args: [],
		abi: ABI,
		address: CONTRACT_ADDR,
		watch: true,
	});

  console.log(listings, data, error, "ddd")


	useEffect(() => {
		if (data != null && Array.isArray(data)) {
			let formattedListing = data.map((listing) => ({
				amount: listing.amount.toString(),
				seller: listing.seller.toString(16),
				nft_contract_address: listing.nft_contract_address.toString(16),
				listing_id: listing.listing_id.toString(),
				token_id: listing.token_id,
			}));

			setListings(formattedListing);
		}
	}, [data]);


	return {
		isLoading,
		listings,
	};
};

export default useListingHook;
