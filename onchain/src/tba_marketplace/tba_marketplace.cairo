use starknet::ContractAddress;

#[starknet::contract]
pub mod TBAMarketplace {
    use core::{
        serde::Serde, byte_array::ByteArray, traits::{TryInto, Into}, num::traits::zero::Zero,
        array::{Array, ArrayTrait}
    };
    use tbamarketplace::{
        interfaces::{ITBAMarketplace::ITBAMarketplace},
        base::{
            types::{Listing, Bid, TBAListed, BidPlaced},
            errors::Errors::{
                ZERO_ADDRESS_CALLER, ZERO_BID_AMOUNT, INACTIVE_LISTING, INVALID_LISTING_OWNER,
                INVALID_BID_OWNER, TBA_LOCKED, CALLER_NOT_OWNER
            }
        }
    };
    use starknet::{
        ContractAddress, get_caller_address, get_contract_address, contract_address_const,
        account::Call
    };
    use openzeppelin::{
        token::{
            erc20::interface::{ERC20ABIDispatcher, ERC20ABIDispatcherTrait},
            erc721::interface::{IERC721Dispatcher, IERC721DispatcherTrait, IERC721LibraryDispatcher}
        }
    };
    use token_bound_accounts::interfaces::{
        IAccount::{IAccountDispatcher, IAccountDispatcherTrait},
    };

    #[storage]
    struct Storage {
        name: ByteArray,
        listing_count: u256, // total number of listings
        listings: LegacyMap<u256, Listing>, // <listing_id, Listing>
        bid_count: u256, // total number of bids
        bids: LegacyMap<(u256, u256), Bid>, // <(listing_id, bid_index), Bid>
    }


    // events
    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        TBAListed: TBAListed,
        BidPlaced: BidPlaced,
    }


    #[constructor]
    fn constructor(ref self: ContractState) {
        let name = "TBA Marketplace";

        self.name.write(name);
    }

    #[abi(embed_v0)]
    impl TBAMarketplaceimpl of ITBAMarketplace<ContractState> {
        // GETTERS
        fn get_name(self: @ContractState) -> ByteArray {
            self.name.read()
        }

        fn get_listings(self: @ContractState) -> Array<Listing> {
            let listing_count = self.listing_count.read();
            let mut i: u256 = 0;

            let mut listings: Array<Listing> = ArrayTrait::new();

            loop {
                if i > listing_count {
                    break;
                }

                let listing = self.listings.read(i);
                listings.append(listing);

                i += 1;
            };

            listings
        }

        fn get_listing(self: @ContractState, listing_id: u256) -> Listing {
            self.listings.read(listing_id)
        }

        fn get_bids(self: @ContractState, listing_id: u256) -> Array<Bid> {
            let bid_count = self.bid_count.read();
            let mut i: u256 = 0;

            let mut bids: Array<Bid> = ArrayTrait::new();

            loop {
                if i > bid_count {
                    break;
                }

                let bid = self.bids.read((listing_id, i));
                bids.append(bid);

                i += 1;
            };

            bids
        }

        fn get_bid(self: @ContractState, listing_id: u256, bid_id: u256) -> Bid {
            self.bids.read((listing_id, bid_id))
        }

        // WRITES
        fn list_tba(ref self: ContractState, tba_address: ContractAddress, amount: u256) -> u256 {
            let account_dispatcher = IAccountDispatcher { contract_address: tba_address };

            let caller = get_caller_address();

            assert(caller.is_non_zero(), ZERO_ADDRESS_CALLER);

            let token_owner = account_dispatcher.owner();

            assert(token_owner == caller, CALLER_NOT_OWNER);

            let (is_locked, _time_remaining) = account_dispatcher.is_locked();
            assert(!is_locked, TBA_LOCKED);

            let listing_count = self.listing_count.read();
            let listing_id = listing_count + 1;

            let listing = Listing {
                listing_id: listing_id,
                seller: caller,
                tba_address: tba_address,
                amount: amount,
                is_active: true
            };

            self.listings.write(listing_id, listing);
            self.listing_count.write(listing_id);

            listing_id
        }

        fn place_bid(ref self: ContractState, listing_id: u256, amount: u256) {
            let caller = get_caller_address();

            assert(caller.is_non_zero(), ZERO_ADDRESS_CALLER);
            assert(amount.is_non_zero(), ZERO_BID_AMOUNT);

            let listing = self.listings.read(listing_id);
            assert(listing.is_active, INACTIVE_LISTING);

            let bid_count = self.bid_count.read();
            let bid_id = bid_count + 1;

            let bid = Bid { bid_id: bid_id, bidder: caller, amount: amount, is_active: true };

            self.bid_count.write(bid_id);
            self.bids.write((listing_id, bid_id), bid);
        }

        fn accept_bid(ref self: ContractState, listing_id: u256, bid_id: u256) {
            let caller = get_caller_address();

            let listing = self.listings.read(listing_id);
            assert(caller == listing.seller, INVALID_LISTING_OWNER);

            let bid = self.bids.read((listing_id, bid_id));

            let buyer = bid.bidder;
            let amount = bid.amount;
            let tba_address = listing.tba_address;

            let (nft_contract_address, token_id) = IAccountDispatcher {
                contract_address: tba_address
            }
                .token();

            IERC721Dispatcher { contract_address: nft_contract_address }
                .transfer_from(caller, buyer, token_id);

            let listing = Listing { is_active: false, ..listing, };

            self.listings.write(listing_id, listing);
        }

        fn cancel_listing(ref self: ContractState, listing_id: u256) {
            let caller = get_caller_address();

            let listing = self.listings.read(listing_id);
            assert(caller == listing.seller, INVALID_LISTING_OWNER);

            let listing = Listing { is_active: false, ..listing };

            self.listings.write(listing_id, listing);
        }

        fn cancel_bid(ref self: ContractState, listing_id: u256, bid_index: u256) {
            let caller = get_caller_address();

            let bid = self.bids.read((listing_id, bid_index));

            assert(bid.bidder == caller, INVALID_BID_OWNER);

            let bid = Bid { is_active: false, ..bid };

            self.bids.write((listing_id, bid_index), bid);
        }
    }
}
