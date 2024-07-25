use core::result::ResultTrait;
use core::traits::TryInto;
use starknet::{ContractAddress, ClassHash};
use snforge_std::{declare, ContractClassTrait, start_cheat_caller_address};
use token_bound_accounts::interfaces::IRegistry::{
    IRegistryDispatcher, IRegistryDispatcherTrait, IRegistryLibraryDispatcher
};
use token_bound_accounts::test_helper::erc721_helper::{
    IERC721Dispatcher, IERC721DispatcherTrait, ERC721
};

pub const USER_ONE: felt252 = 'Bob';
pub const USER_TWO: felt252 = 'Alice';

pub fn deploy_registry() -> ContractAddress {
    let registry_contract = declare("Registry").unwrap();
    let (registry_contract_address, _) = registry_contract.deploy(@ArrayTrait::new()).unwrap();

    registry_contract_address
}

pub fn deploy_erc721() -> ContractAddress {
    let erc721_contract = declare("ERC721").unwrap();
    let mut erc721_constructor_calldata = array!['tokenbound', 'TBA'];
    let (erc721_contract_address, _) = erc721_contract
        .deploy(@erc721_constructor_calldata)
        .unwrap();

    let dispatcher = IERC721Dispatcher { contract_address: erc721_contract_address };
    dispatcher.mint(USER_ONE.try_into().unwrap(), 1.try_into().unwrap());

    erc721_contract_address
}


pub fn deploy_tbamarketplace() -> ContractAddress {
    let contract_name = "TBAMarketplace";
    let contract = declare(contract_name).unwrap();
    let (contract_address, _) = contract.deploy(@ArrayTrait::new()).unwrap();
    contract_address
}

pub fn deploy_tba_account() -> ContractAddress {
    let erc721_contract_address = deploy_erc721();
    let registry_contract_address = deploy_registry();
    let registry_dispatcher = IRegistryDispatcher { contract_address: registry_contract_address };
    let erc721_dispatcher = IERC721Dispatcher { contract_address: erc721_contract_address };

    let token_owner = erc721_dispatcher.owner_of(1.try_into().unwrap());

    start_cheat_caller_address(registry_contract_address, token_owner);

    let account_contract = declare("Account").unwrap();

    let token_id: u256 = 1;
    let mut account_constructor_calldata = ArrayTrait::new();

    erc721_contract_address.serialize(ref account_constructor_calldata);
    token_id.serialize(ref account_constructor_calldata);

    let (_account_contract_address, _) = account_contract
        .deploy(@account_constructor_calldata)
        .unwrap();

    let tba_account = registry_dispatcher
        .create_account(
            account_contract.class_hash.try_into().unwrap(), erc721_contract_address, token_id, 1999
        );

    tba_account
}
