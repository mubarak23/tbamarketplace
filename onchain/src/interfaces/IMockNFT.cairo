use starknet::ContractAddress;

#[starknet::interface]
pub trait IMockNFT<TContractState> {
    fn mint_mock_nft(ref self: TContractState, address: ContractAddress);
    fn get_user_token_id(self: @TContractState, user: ContractAddress) -> u256;
    fn get_token_mint_timestamp(self: @TContractState, token_id: u256) -> u64;
    fn get_last_minted_id(self: @TContractState) -> u256;
}

