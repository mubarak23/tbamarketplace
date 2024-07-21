use tbamarketplace::base::types::{BidsParam, SellerNFTForBids};

#[starknet::interface]
pub trait IBids<TContractState> {
    fn submit_nft_for_bid(ref self: TContractState, nft_address: felt252);
    fn submit_bid(ref self: TContractState, nft_address: felt252, amount: u64);
    fn select_bid(ref self: TContractState, bid_id: felt252, buyer: felt252);
}

