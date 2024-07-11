use starknet::ContractAddress;
#[starknet::contract]
pub mod Bid {
    use core::num::traits::zero::Zero;
    use core::traits::{TryInto, Into};
    use core::byte_array::ByteArray;
    use tbamarketplace::interfaces::IBid::IBids;
    use tbamarketplace::base::types::{SellerNFTForBids};
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
        accepted_bids_nft: LegacyMap<felt252, u128>, //// < buyer_address, nft_address>
        place_bids: LegacyMap<u128, LegacyMap<felt252, u64>>, // <bid_id, <buyer, price>>
        bid_stack: LegacyMap<felt252, u64>, // <buyer_address, amount_stack>
        bid_id_num: u128,
        total_nft_for_bid: u128
    }
    // events

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        SubmitNFTForBid: SubmitNFTForBid,
        BidPlaceOnNFTTBA: BidPlaceOnNFTTBA
    }

    #[derive(Drop, starknet::Event)]
    struct SubmitNFTForBid {
        pub bid_id: u128,
        pub nft_address: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct BidPlaceOnNFTTBA {
        pub bid_id: u128,
        pub buyer_address: felt252,
        pub amount: u64,
    }

    // maybe we need a constructor 
    // we will remove this once we figure out a way to generate random number from pragma

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.total_nft_for_bid.write(0);
    }

    #[abi(embed_v0)]
    impl Bidsimpl of IBids<ContractState> {
        fn submit_nft_for_bid(ref self: TContractState, nft_address: felt252, bid_id: felt252) {
            self.seller_nft.write(get_caller_address(), nft_address);
            self.tba_bids.write(nft_address, bid_id);

            self.total_nft_for_bid.write(self.total_nft_for_bid.read() + 1);

            let event_nft_address = self.seller_nft.read(get_caller_address());
            let event_bid_id = self.tba_bids.read(event_nft_address);

            // dispatch an event that carry the BID_ID and nft address 
            self.emit(SubmitNFTForBid { bid_id: event_bid_id, nft_address: event_nft_address });
        }

        fn submit_bid(ref self: TContractState, nft_address: felt252, amount: u64,) {
            let bid_id = self.tba_bids.read(nft_address);
            assert(!bid_id, 'No Bid Place for this nft');

            self.bid_stack.write(get_caller_address(), amount);
            // dispatch bid place event 
            self
                .emit(
                    BidPlaceOnNFTTBA {
                        bid_id: self.tba_bids.read(nft_address),
                        buyer_address: get_caller_address(),
                        amount: amount
                    }
                );
        }


        fn select_bid(ref self: ContractState, bid_id: u128, amount: u64, buyer: felt252) {
            // check the bid exist 
            let nft_address = self.tba_bids.read(bid_id);
            assert(!nft_address, "No Nft Available For Bidding");
            // pull buyer bid and compare with bid_id
            let selected_bid = self.place_bids.read((buyer, amount));

            assert(selected_bid != bid_id, "Buyer did not place this bid");
        // transfer the token to the seller

        // transfer the amoun to the seller 

        // refunds all stake bit by buyer

        }
    }
}
