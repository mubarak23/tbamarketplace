use starknet::{ContractAddress, class_hash::ClassHash};
use tbamarketplace::base::types::{Listing, Bid};

#[starknet::interface]
pub trait ITBAMarketplace<TContractState> {
    // GETTERS
    fn get_name(self: @TContractState) -> ByteArray;
    fn get_listings(self: @TContractState) -> Array<Listing>;
    fn get_listing(self: @TContractState, listing_id: u256) -> Listing;
    fn get_bids(self: @TContractState, listing_id: u256) -> Array<Bid>;
    fn get_bid(self: @TContractState, listing_id: u256, bid_id: u256) -> Bid;

    // WRITES
    fn list_tba(ref self: TContractState, tba_address: ContractAddress, amount: u256);
    fn place_bid(ref self: TContractState, listing_id: u256, amount: u256);
    fn accept_bid(ref self: TContractState, listing_id: u256, bid_id: u256);
    fn cancel_listing(ref self: TContractState, listing_id: u256);
    fn cancel_bid(ref self: TContractState, listing_id: u256, bid_id: u256);
}

