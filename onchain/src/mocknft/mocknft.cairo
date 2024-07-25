#[starknet::contract]
mod MockNFT {
    use openzeppelin::introspection::src5::SRC5Component;
    use openzeppelin::token::erc721::{ERC721Component, ERC721HooksEmptyImpl};
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use tbamarketplace::interfaces::IMockNFT::IMockNFT;

    component!(path: ERC721Component, storage: erc721, event: ERC721Event);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);

    // ERC721 Mixin
    #[abi(embed_v0)]
    impl ERC721MixinImpl = ERC721Component::ERC721MixinImpl<ContractState>;
    impl ERC721InternalImpl = ERC721Component::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        erc721: ERC721Component::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage,
        admin: ContractAddress,
        last_minted_id: u256,
        mint_timestamp: LegacyMap<u256, u64>,
        user_token_id: LegacyMap<ContractAddress, u256>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC721Event: ERC721Component::Event,
        #[flat]
        SRC5Event: SRC5Component::Event
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        let name = "Mock NFT";
        let symbol = "MNFT";
        let base_uri = "ipfs:://QmSrXyLMjop1dyTmm1aCuAAUhTnJkgcFoqNwEmJfXRoA1m/";

        self.erc721.initializer(name, symbol, base_uri);
    }

    #[abi(embed_v0)]
    impl MockNFTImpl of IMockNFT<ContractState> {
        fn mint_mock_nft(ref self: ContractState, address: ContractAddress) {
            let mut token_id = self.last_minted_id.read() + 1;
            self.erc721._mint(address, token_id);
            let timestamp: u64 = get_block_timestamp();

            self.user_token_id.write(address, token_id);
            self.last_minted_id.write(token_id);
            self.mint_timestamp.write(token_id, timestamp);
        }

        fn get_user_token_id(self: @ContractState, user: ContractAddress) -> u256 {
            self.user_token_id.read(user)
        }

        fn get_token_mint_timestamp(self: @ContractState, token_id: u256) -> u64 {
            self.mint_timestamp.read(token_id)
        }

        fn get_last_minted_id(self: @ContractState) -> u256 {
            self.last_minted_id.read()
        }
    }
}
