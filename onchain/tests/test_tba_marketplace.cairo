use core::traits::PanicDestruct;
use core::serde::Serde;
use core::traits::TryInto;
use starknet::ContractAddress;
use snforge_std::{declare, ContractClassTrait, start_cheat_caller_address};
use tbamarketplace::{
    interfaces::ITBAMarketplace::{ITBAMarketplaceDispatcher, ITBAMarketplaceDispatcherTrait},
    test_helper::erc721::{IERC721Dispatcher, IERC721DispatcherTrait}
};
use openzeppelin::{token::{erc20::interface::{ERC20ABIDispatcher, ERC20ABIDispatcherTrait}}};
use super::{
    setup::{
        deploy_registry, deploy_erc721, deploy_tba_account, deploy_tbamarketplace, USER_ONE,
        USER_TWO
    }
};
use token_bound_accounts::interfaces::IRegistry::{IRegistryDispatcher, IRegistryDispatcherTrait};
use token_bound_accounts::interfaces::IAccount::{IAccountDispatcher, IAccountDispatcherTrait};

#[test]
fn test_get_name() {
    let tba_marketplace_contract_address = deploy_tbamarketplace();

    let tba_marketplace_dispatcher = ITBAMarketplaceDispatcher {
        contract_address: tba_marketplace_contract_address
    };
    let name = tba_marketplace_dispatcher.get_name();
    assert(name == "TBA Marketplace", 'Incorrect name');
}

#[test]
fn test_list_tba() {
    let tba_markerplace_contract_address = deploy_tbamarketplace();

    let tba_account = deploy_tba_account();

    let token_owner = IAccountDispatcher { contract_address: tba_account }.owner();

    start_cheat_caller_address(tba_markerplace_contract_address, token_owner);

    let listing_id = ITBAMarketplaceDispatcher {
        contract_address: tba_markerplace_contract_address
    }
        .list_tba(tba_account, 100);

    let listing = ITBAMarketplaceDispatcher { contract_address: tba_markerplace_contract_address }
        .get_listing(listing_id);

    assert(1.try_into().unwrap() == listing.listing_id, 'Incorrect listing id');
}

#[test]
fn test_place_bid() {
    let tba_markerplace_contract_address = deploy_tbamarketplace();
    let tba_marketplace_dispatcher = ITBAMarketplaceDispatcher {
        contract_address: tba_markerplace_contract_address
    };
    let tba_account = deploy_tba_account();
    let account_dispatcher = IAccountDispatcher { contract_address: tba_account };

    let token_owner = account_dispatcher.owner();

    start_cheat_caller_address(tba_markerplace_contract_address, token_owner);

    let listing_id = tba_marketplace_dispatcher.list_tba(tba_account, 100);
    let amount: u256 = 120;

    start_cheat_caller_address(tba_markerplace_contract_address, USER_TWO.try_into().unwrap());

    tba_marketplace_dispatcher.place_bid(listing_id, amount);

    let bid = tba_marketplace_dispatcher.get_bid(listing_id, 1);

    assert(bid.bidder == USER_TWO.try_into().unwrap(), 'Incorrect bidder');
}
// #[test]
// fn test_accept_bid() {
//     let erc721_contract_address = deploy_erc721();
//     let erc721_dispatcher = IERC721Dispatcher { contract_address: erc721_contract_address };
//     let tba_markerplace_contract_address = deploy_tbamarketplace();
//     let tba_marketplace_dispatcher = ITBAMarketplaceDispatcher {
//         contract_address: tba_markerplace_contract_address
//     };
//     let tba_account = deploy_tba_account();
//     let account_dispatcher = IAccountDispatcher { contract_address: tba_account };

//     let token_owner = account_dispatcher.owner();

//     erc721_dispatcher.approve(tba_markerplace_contract_address, 1.try_into().unwrap());

//     start_cheat_caller_address(tba_markerplace_contract_address, token_owner);

//     let listing_id = tba_marketplace_dispatcher.list_tba(tba_account, 100);
//     let amount: u256 = 120;

//     start_cheat_caller_address(tba_markerplace_contract_address, USER_TWO.try_into().unwrap());

//     tba_marketplace_dispatcher.place_bid(listing_id, amount);

//     start_cheat_caller_address(tba_markerplace_contract_address, token_owner);

//     tba_marketplace_dispatcher.accept_bid(listing_id, 1.try_into().unwrap());

//     let token_owner = account_dispatcher.owner();

//     assert(token_owner == USER_TWO.try_into().unwrap(), 'Incorrect owner');
// }

#[test]
fn test_cancel_listing() {
    let tba_markerplace_contract_address = deploy_tbamarketplace();

    let tba_account = deploy_tba_account();

    let token_owner = IAccountDispatcher { contract_address: tba_account }.owner();

    start_cheat_caller_address(tba_markerplace_contract_address, token_owner);

    let listing_id = ITBAMarketplaceDispatcher {
        contract_address: tba_markerplace_contract_address
    }
        .list_tba(tba_account, 100);

    ITBAMarketplaceDispatcher { contract_address: tba_markerplace_contract_address }
        .cancel_listing(listing_id);

    let listing = ITBAMarketplaceDispatcher { contract_address: tba_markerplace_contract_address }
        .get_listing(listing_id);

    assert(!listing.is_active, 'Incorrect listing status');
}

#[test]
fn test_cancel_bid() {
    let tba_markerplace_contract_address = deploy_tbamarketplace();
    let tba_marketplace_dispatcher = ITBAMarketplaceDispatcher {
        contract_address: tba_markerplace_contract_address
    };
    let tba_account = deploy_tba_account();
    let account_dispatcher = IAccountDispatcher { contract_address: tba_account };

    let token_owner = account_dispatcher.owner();

    start_cheat_caller_address(tba_markerplace_contract_address, token_owner);

    let listing_id = tba_marketplace_dispatcher.list_tba(tba_account, 100);
    let amount: u256 = 120;

    start_cheat_caller_address(tba_markerplace_contract_address, USER_TWO.try_into().unwrap());

    tba_marketplace_dispatcher.place_bid(listing_id, amount);

    tba_marketplace_dispatcher.cancel_bid(listing_id, 1.try_into().unwrap());

    let bid = tba_marketplace_dispatcher.get_bid(listing_id, 1);

    assert(!bid.is_active, 'Incorrect bid status');
}

