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
pub struct TBAListed {
    pub listing_id: u256,
    pub seller: ContractAddress,
    pub nft_contract_address: ContractAddress,
    pub amount: u256,
}

#[derive(Drop, starknet::Event)]
pub struct BidPlaced {
    pub bid_id: u256,
    pub nft_address: ContractAddress,
    pub bidder: ContractAddress,
    pub amount: u256,
}
