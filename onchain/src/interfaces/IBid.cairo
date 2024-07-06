use tbamarketplace::base::types::{BidsParam};

#[starknet::interface]
pub trait IBids<TContractState> {
    fn submit_nft_for_bid(ref self: TContractState, nft: felt252);
    fn submit_bid(ref self: TContractState, nft: felt252, amount: u64);
    fn list_nft_bids(self: @TContractState, bid_id: felt252) -> BidsParam;
    fn select_bid(ref self: TContractState, bid_id: felt252, buyer: felt252);
}

