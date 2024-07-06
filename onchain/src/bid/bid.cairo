#[starknet::contract]
pub mod Bid {
    use core::num::traits::zero::Zero;
    use core::traits::{TryInto, Into};
    use core::byte_array::ByteArray;

    #[storage]
    struct Storage {
        seller_nft: LegacyMap<felt252, felt252>, // <seller_address, nft_address>
        tba_bids: LegacyMap<felt252, u64>, // <nft_address, bid_id>
        accepted_bids: LegacyMap<felt252, LegacyMap<u64, u64>>, // < buyer_address, <bid_id, price>>
        place_bids: LegacyMap<u64, LegacyMap<felt252, u64>> // <bid_id, <buyer, price>>
    }
}
