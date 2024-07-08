#[starknet::contract]
pub mod Bid {
    use core::num::traits::zero::Zero;
    use core::traits::{TryInto, Into};
    use core::byte_array::ByteArray;
    use tbamarketplace::interfaces::IBid::IBids;
    use starknet::{
        ContractAddress, get_caller_address, get_contract_address, contract_address_const
    };


    #[storage]
    struct Storage {
        seller_nft: LegacyMap<felt252, felt252>, // <seller_address, nft_address>
        tba_bids: LegacyMap<felt252, u128>, // <nft_address, bid_id>
        accepted_bids: LegacyMap<
            felt252, LegacyMap<u128, u64>
        >, // < buyer_address, <bid_id, price>>
        place_bids: LegacyMap<u64, LegacyMap<felt252, u128>>, // <bid_id, <buyer, price>>
        bid_id_num: u128,
    }
    // events

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        SubmittedNFTForBid: SubmittedNFTForBid
    }

    #[derive(Drop, starknet::Event)]
    struct SubmittedNFTForBid {
        pub bid_id: u128,
        pub nft_address: felt252,
    }

    // maybe we need a constructor 
    // we will remove this once we figure out a way to generate random number from pragma

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.bid_id_num(0);
    }

    #[abi(embed_v0)]
    impl Bidsimpl of IBids<ContractState> {
        fn submit_nft_for_bid(ref self: TContractState, nft: felt252) {
            // use pragma to generate random number for bidId

            let bid_id = self.bid_id_num.read() + 1;
            self.seller_nft.write(get_caller_address(), nft);
            self.tba_bids.write(nft, bid_id);
            // update the bidId
            self.bid_id_num.write(self.bid_id_num.read + 1);

            let event_bid_id = self.bid_id_num.read(); // this is to avoid copy trait wahala

            let event_nft_address = self.seller_nft.read(get_caller_address());
            // dispatch an event that carry the BID_ID and nft address 
            self.emit(SubmittedNFTForBid { bid_id: event_bid_id, nft_address: event_nft_address });
        }
    }
}
