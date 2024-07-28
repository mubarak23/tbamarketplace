use core::traits::PanicDestruct;
use core::serde::Serde;
use core::traits::TryInto;
use starknet::ContractAddress;
use snforge_std::{
    declare, ContractClassTrait, start_cheat_caller_address, stop_cheat_caller_address
};
use tbamarketplace::{
    interfaces::ITBAMarketplace::{ITBAMarketplaceDispatcher, ITBAMarketplaceDispatcherTrait},
    test_helper::{
        erc20::{IERC20Dispatcher, IERC20DispatcherTrait},
        erc721::{IERC721Dispatcher, IERC721DispatcherTrait}
    }
};
use super::setup::{__setup__, USER_ONE, USER_TWO};
use token_bound_accounts::interfaces::IRegistry::{IRegistryDispatcher, IRegistryDispatcherTrait};
use token_bound_accounts::interfaces::IAccount::{IAccountDispatcher, IAccountDispatcherTrait};

// #[test]
// fn test_get_name() {
//     let tba_marketplace_contract_address = deploy_tbamarketplace();

//     let tba_marketplace_dispatcher = ITBAMarketplaceDispatcher {
//         contract_address: tba_marketplace_contract_address
//     };
//     let name = tba_marketplace_dispatcher.get_name();
//     assert(name == "TBA Marketplace", 'Incorrect name');
// }

// #[test]
// fn test_list_tba() {
//     let tba_markerplace_contract_address = deploy_tbamarketplace();

//     let tba_account = deploy_tba_account();

//     let token_owner = IAccountDispatcher { contract_address: tba_account }.owner();

//     start_cheat_caller_address(tba_markerplace_contract_address, token_owner);

//     let listing_id = ITBAMarketplaceDispatcher {
//         contract_address: tba_markerplace_contract_address
//     }
//         .list_tba(tba_account, 100);

//     let listing = ITBAMarketplaceDispatcher { contract_address: tba_markerplace_contract_address }
//         .get_listing(listing_id);

//     assert(1.try_into().unwrap() == listing.listing_id, 'Incorrect listing id');
// }

// #[test]
// fn test_place_bid() {
//     let tba_markerplace_contract_address = deploy_tbamarketplace();
//     let tba_marketplace_dispatcher = ITBAMarketplaceDispatcher {
//         contract_address: tba_markerplace_contract_address
//     };
//     let tba_account = deploy_tba_account();
//     let account_dispatcher = IAccountDispatcher { contract_address: tba_account };

//     let token_owner = account_dispatcher.owner();

//     start_cheat_caller_address(tba_markerplace_contract_address, token_owner);

//     let listing_id = tba_marketplace_dispatcher.list_tba(tba_account, 100);
//     let amount: u256 = 120;

//     start_cheat_caller_address(tba_markerplace_contract_address, USER_TWO.try_into().unwrap());

//     tba_marketplace_dispatcher.place_bid(listing_id, amount);

//     let bid = tba_marketplace_dispatcher.get_bid(listing_id, 1);

//     assert(bid.bidder == USER_TWO.try_into().unwrap(), 'Incorrect bidder');
// }

#[test]
fn test_accept_bid() {
    let (
        tba_markerplace_contract_address,
        tba_account,
        erc20_contract_address,
        erc721_contract_address
    ) =
        __setup__();
    let tba_marketplace_dispatcher = ITBAMarketplaceDispatcher {
        contract_address: tba_markerplace_contract_address
    };
    let erc20_dispatcher = IERC20Dispatcher { contract_address: erc20_contract_address };
    let erc721_dispatcher = IERC721Dispatcher { contract_address: erc721_contract_address };
    let account_dispatcher = IAccountDispatcher { contract_address: tba_account };

    // get tba owner
    let token_owner = account_dispatcher.owner();

    // approve contract to manage user one erc721 assets
    start_cheat_caller_address(erc721_contract_address, token_owner);
    erc721_dispatcher.approve(tba_markerplace_contract_address, 1.try_into().unwrap());
    stop_cheat_caller_address(erc721_contract_address);

    // list tba
    start_cheat_caller_address(tba_markerplace_contract_address, token_owner);
    tba_marketplace_dispatcher.list_tba(tba_account, 100);
    stop_cheat_caller_address(tba_markerplace_contract_address);

    // approve contract to manage user two erc20 assets
    start_cheat_caller_address(erc20_contract_address, USER_TWO.try_into().unwrap());
    erc20_dispatcher.approve(tba_markerplace_contract_address, 200.try_into().unwrap());
    stop_cheat_caller_address(erc20_contract_address);

    // place bid on tba
    start_cheat_caller_address(tba_markerplace_contract_address, USER_TWO.try_into().unwrap());
    tba_marketplace_dispatcher.place_bid(1.try_into().unwrap(), 150.try_into().unwrap());
    stop_cheat_caller_address(tba_markerplace_contract_address);

    // accept bid
    start_cheat_caller_address(tba_markerplace_contract_address, token_owner);
    tba_marketplace_dispatcher.accept_bid(1.try_into().unwrap(), 1.try_into().unwrap());
}
// #[test]
// fn test_cancel_listing() {
//     let tba_markerplace_contract_address = deploy_tbamarketplace();

//     let tba_account = deploy_tba_account();

//     let token_owner = IAccountDispatcher { contract_address: tba_account }.owner();

//     start_cheat_caller_address(tba_markerplace_contract_address, token_owner);

//     let listing_id = ITBAMarketplaceDispatcher {
//         contract_address: tba_markerplace_contract_address
//     }
//         .list_tba(tba_account, 100);

//     ITBAMarketplaceDispatcher { contract_address: tba_markerplace_contract_address }
//         .cancel_listing(listing_id);

//     let listing = ITBAMarketplaceDispatcher { contract_address: tba_markerplace_contract_address }
//         .get_listing(listing_id);

//     assert(!listing.is_active, 'Incorrect listing status');
// }

// #[test]
// fn test_cancel_bid() {
//     let tba_markerplace_contract_address = deploy_tbamarketplace();
//     let tba_marketplace_dispatcher = ITBAMarketplaceDispatcher {
//         contract_address: tba_markerplace_contract_address
//     };
//     let tba_account = deploy_tba_account();
//     let account_dispatcher = IAccountDispatcher { contract_address: tba_account };

//     let token_owner = account_dispatcher.owner();

//     start_cheat_caller_address(tba_markerplace_contract_address, token_owner);

//     let listing_id = tba_marketplace_dispatcher.list_tba(tba_account, 100);
//     let amount: u256 = 120;

//     start_cheat_caller_address(tba_markerplace_contract_address, USER_TWO.try_into().unwrap());

//     tba_marketplace_dispatcher.place_bid(listing_id, amount);

//     tba_marketplace_dispatcher.cancel_bid(listing_id, 1.try_into().unwrap());

//     let bid = tba_marketplace_dispatcher.get_bid(listing_id, 1);

//     assert(!bid.is_active, 'Incorrect bid status');
// }


