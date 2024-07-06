use core::serde::Serde;
use core::option::OptionTrait;

#[derive(Drop, Serde, starknet::Store, Clone)]
pub struct BidsParam {
    pub buyer: felt252,
    pub price: u64,
}
