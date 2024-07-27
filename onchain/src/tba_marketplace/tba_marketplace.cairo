use starknet::ContractAddress;

const STRK_TOKEN_CONTRACT_ADDRESS: felt252 =
    0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d;

#[starknet::contract]
pub mod TBAMarketplace {
    use super::{STRK_TOKEN_CONTRACT_ADDRESS};
    use alexandria_math::fast_power::fast_power;
    use core::{
        serde::Serde, byte_array::ByteArray, traits::{TryInto, Into}, num::traits::zero::Zero,
        array::{Array, ArrayTrait}
    };
    use tbamarketplace::{
        interfaces::{ITBAMarketplace::ITBAMarketplace},
        base::{
            types::{Listing, Bid, TBAEvent, BidEvent, BidAccepted},
            errors::Errors::{
                ZERO_ADDRESS_CALLER, ZERO_BID_AMOUNT, INACTIVE_LISTING, INVALID_LISTING_OWNER,
                INVALID_BID_OWNER, TBA_LOCKED, CALLER_NOT_OWNER, INVALID_SPENDING_ALLOWANCE
            }
        }
    };
    use starknet::{
        ContractAddress, get_caller_address, get_contract_address, contract_address_const,
        account::Call, class_hash::ClassHash, syscalls::replace_class_syscall
    };
    use openzeppelin::{
        token::{
            erc20::interface::{ERC20ABIDispatcher, ERC20ABIDispatcherTrait},
            erc721::interface::{IERC721Dispatcher, IERC721DispatcherTrait, IERC721LibraryDispatcher}
        },
        access::ownable::{OwnableComponent, ownable::OwnableComponent::InternalTrait},
        upgrades::{
            {UpgradeableComponent, interface::IUpgradeable},
            upgradeable::UpgradeableComponent::InternalTrait as UpgradeableInternalTrait
        }
    };
    use token_bound_accounts::interfaces::{
        IAccount::{IAccountDispatcher, IAccountDispatcherTrait},
    };

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: UpgradeableComponent, storage: upgradeable, event: UpgradeableEvent);

    impl UpgradeableInternalImpl = UpgradeableComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        name: ByteArray,
        listing_count: u256, // total number of listings
        listings: LegacyMap<u256, Listing>, // <listing_id, Listing>
        bid_count: u256, // total number of bids
        bids: LegacyMap<(u256, u256), Bid>, // <(listing_id, bid_index), Bid>
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        upgradeable: UpgradeableComponent::Storage
    }

    // events
    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        TBAEvent: TBAEvent,
        BidEvent: BidEvent,
        BidAccepted: BidAccepted,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        UpgradeableEvent: UpgradeableComponent::Event
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        let name = "TBA Marketplace";

        self.name.write(name);
        self.ownable.initializer(owner);
    }

    #[abi(embed_v0)]
    impl UpgradeableImpl of IUpgradeable<ContractState> {
        fn upgrade(ref self: ContractState, new_class_hash: ClassHash) {
            self.ownable.assert_only_owner();
            self.upgradeable._upgrade(new_class_hash);
        }
    }


    #[abi(embed_v0)]
    impl TBAMarketplaceimpl of ITBAMarketplace<ContractState> {
        // GETTERS
        fn get_name(self: @ContractState) -> ByteArray {
            self.name.read()
        }

        fn get_listings(self: @ContractState) -> Array<Listing> {
            let listing_count = self.listing_count.read();
            let mut i: u256 = 1;

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
            let mut i: u256 = 1;

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
        fn list_tba(ref self: ContractState, tba_address: ContractAddress, amount: u256) {
            let caller = get_caller_address();

            assert(caller.is_non_zero(), ZERO_ADDRESS_CALLER);

            self._validate_is_locked(tba_address);
            self._validate_ownership_and_approval(tba_address);

            let listing_count = self.listing_count.read();
            let listing_id = listing_count + 1;

            let converted_amount = self._convert_amount(amount);

            let listing = Listing {
                listing_id: listing_id,
                seller: caller,
                tba_address: tba_address,
                amount: converted_amount,
                is_active: true
            };

            self.listings.write(listing_id, listing);
            self.listing_count.write(listing_id);

            self.emit(TBAEvent { listing_id: listing_id, listing: listing });
        }

        fn place_bid(ref self: ContractState, listing_id: u256, amount: u256) {
            let caller = get_caller_address();

            assert(caller.is_non_zero(), ZERO_ADDRESS_CALLER);
            assert(amount.is_non_zero(), ZERO_BID_AMOUNT);

            self._validate_erc20_allowance(amount);

            let listing = self.listings.read(listing_id);
            assert(listing.is_active, INACTIVE_LISTING);

            let bid_count = self.bid_count.read();
            let bid_id = bid_count + 1;

            let converted_amount = self._convert_amount(amount);

            let bid = Bid {
                bid_id: bid_id, bidder: caller, amount: converted_amount, is_active: true
            };

            self.bid_count.write(bid_id);
            self.bids.write((listing_id, bid_id), bid);

            self.emit(BidEvent { bid_id: bid_id, bid: bid });
        }

        fn accept_bid(ref self: ContractState, listing_id: u256, bid_id: u256) {
            let caller = get_caller_address();

            let listing = self.listings.read(listing_id);
            assert(caller == listing.seller, INVALID_LISTING_OWNER);

            let bid = self.bids.read((listing_id, bid_id));

            let buyer = bid.bidder;
            let amount = bid.amount;
            let tba_address = listing.tba_address;

            let account_dispatcher = IAccountDispatcher { contract_address: tba_address };
            let (token_contract_address, token_id) = account_dispatcher.token();

            let strk_token_dispatcher = ERC20ABIDispatcher {
                contract_address: STRK_TOKEN_CONTRACT_ADDRESS.try_into().unwrap()
            };
            let token_contract_dispatcher = IERC721Dispatcher {
                contract_address: token_contract_address
            };

            let mut calldata = ArrayTrait::new();
            caller.serialize(ref calldata);
            buyer.serialize(ref calldata);
            token_id.serialize(ref calldata);

            let call = Call {
                to: token_contract_address,
                selector: selector!("transfer_from"),
                calldata: ArrayTrait::span(@calldata)
            };

            account_dispatcher.__execute__(array![call]);

            token_contract_dispatcher.transfer_from(caller, buyer, token_id);
            strk_token_dispatcher.transfer_from(caller, buyer, amount);

            let listing = Listing { is_active: false, ..listing, };

            self.listings.write(listing_id, listing);

            self
                .emit(
                    BidAccepted {
                        listing_id: listing_id, listing: listing, bid_id: bid_id, bid: bid
                    }
                );
        }

        fn cancel_listing(ref self: ContractState, listing_id: u256) {
            let caller = get_caller_address();

            let listing = self.listings.read(listing_id);
            assert(caller == listing.seller, INVALID_LISTING_OWNER);

            let listing = Listing { is_active: false, ..listing };

            let bid_count = self.bid_count.read();
            let mut i: u256 = 1;

            loop {
                if i > bid_count {
                    break;
                }

                self._cancel_bid(listing_id, i);

                i += 1;
            };

            self.listings.write(listing_id, listing);
        }

        fn cancel_bid(ref self: ContractState, listing_id: u256, bid_id: u256) {
            let caller = get_caller_address();
            let bid = self.bids.read((listing_id, bid_id));

            assert(bid.bidder == caller, INVALID_BID_OWNER);
            self._cancel_bid(listing_id, bid_id);
        }
    }

    #[generate_trait]
    impl Private of PrivateTrait {
        fn _cancel_bid(ref self: ContractState, listing_id: u256, bid_id: u256) {
            let bid = self.bids.read((listing_id, bid_id));
            let bid = Bid { is_active: false, ..bid };

            self.bids.write((listing_id, bid_id), bid);
            self.emit(BidEvent { bid_id: bid_id, bid: bid });
        }

        fn _validate_ownership_and_approval(self: @ContractState, tba_address: ContractAddress) {
            let contract_address = get_contract_address();
            let caller = get_caller_address();
            let account_dispatcher = IAccountDispatcher { contract_address: tba_address };

            let (token_contract_address, token_id) = account_dispatcher.token();

            let token_contract_dispatcher = IERC721Dispatcher {
                contract_address: token_contract_address
            };
            let token_owner = token_contract_dispatcher.owner_of(token_id);
            let approved = token_contract_dispatcher.get_approved(token_id);
            let approved_for_all = token_contract_dispatcher
                .is_approved_for_all(token_owner, contract_address);

            let is_valid = token_owner == caller
                && approved == contract_address || approved_for_all;

            assert(is_valid, CALLER_NOT_OWNER);
        }

        fn _validate_erc20_allowance(self: @ContractState, amount: u256) {
            let contract_address = get_contract_address();
            let caller = get_caller_address();

            let strk_token_dispatcher = ERC20ABIDispatcher {
                contract_address: STRK_TOKEN_CONTRACT_ADDRESS.try_into().unwrap()
            };

            let allowance = strk_token_dispatcher.allowance(caller, contract_address);

            assert(allowance > amount, INVALID_SPENDING_ALLOWANCE);
        }

        fn _validate_is_locked(self: @ContractState, tba_address: ContractAddress) {
            let account_dispatcher = IAccountDispatcher { contract_address: tba_address };

            let (is_locked, _time_remaining) = account_dispatcher.is_locked();
            assert(!is_locked, TBA_LOCKED);
        }

        fn _convert_amount(self: @ContractState, amount: u256) -> u256 {
            let strk_token_dispatcher = ERC20ABIDispatcher {
                contract_address: STRK_TOKEN_CONTRACT_ADDRESS.try_into().unwrap()
            };

            let strk_token_decimals = strk_token_dispatcher.decimals();

            let converted_amount = amount
                * fast_power(10.try_into().unwrap(), strk_token_decimals.try_into().unwrap());

            converted_amount
        }
    }
}
