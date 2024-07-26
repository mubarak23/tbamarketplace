use core::serde::Serde;
use core::option::OptionTrait;
use starknet::ContractAddress;

#[derive(Debug, Drop, Copy, Serde, starknet::Store)]
pub struct Listing {
    pub listing_id: u256,
    pub seller: ContractAddress,
    pub tba_address: ContractAddress,
    pub amount: u256,
    pub is_active: bool
}

#[derive(Debug, Drop, Copy, Serde, starknet::Store)]
pub struct Bid {
    pub bid_id: u256,
    pub bidder: ContractAddress,
    pub amount: u256,
    pub is_active: bool
}

#[derive(Drop, starknet::Event)]
pub struct TBAEvent {
    pub listing_id: u256,
    pub listing: Listing
}

#[derive(Drop, starknet::Event)]
pub struct BidEvent {
    pub bid_id: u256,
    pub bid: Bid
}

#[derive(Drop, starknet::Event)]
pub struct BidAccepted {
    pub listing_id: u256,
    pub listing: Listing,
    pub bid_id: u256,
    pub bid: Bid,
}
