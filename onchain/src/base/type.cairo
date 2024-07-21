use core::serde::Serde;
use core::option::OptionTrait;

#[derive(Drop, Serde, starknet::Store, Clone)]
pub struct BidsParam {
    pub buyer: felt252,
    pub price: u64,
}

#[derive(Drop, Serde, starknet::Store, Clone)]
pub struct SellerNFTForBids {
    pub seller_address: felt252,
    pub nft_address: felt252,
}
