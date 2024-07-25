export const ABI = [
  {
    "name": "TBAMarketplaceimpl",
    "type": "impl",
    "interface_name": "tbamarketplace::interfaces::ITBAMarketplace::ITBAMarketplace"
  },
  {
    "name": "core::byte_array::ByteArray",
    "type": "struct",
    "members": [
      {
        "name": "data",
        "type": "core::array::Array::<core::bytes_31::bytes31>"
      },
      {
        "name": "pending_word",
        "type": "core::felt252"
      },
      {
        "name": "pending_word_len",
        "type": "core::integer::u32"
      }
    ]
  },
  {
    "name": "core::integer::u256",
    "type": "struct",
    "members": [
      {
        "name": "low",
        "type": "core::integer::u128"
      },
      {
        "name": "high",
        "type": "core::integer::u128"
      }
    ]
  },
  {
    "name": "core::bool",
    "type": "enum",
    "variants": [
      {
        "name": "False",
        "type": "()"
      },
      {
        "name": "True",
        "type": "()"
      }
    ]
  },
  {
    "name": "tbamarketplace::base::types::Listing",
    "type": "struct",
    "members": [
      {
        "name": "listing_id",
        "type": "core::integer::u256"
      },
      {
        "name": "seller",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "nft_contract_address",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "token_id",
        "type": "core::integer::u256"
      },
      {
        "name": "amount",
        "type": "core::integer::u256"
      },
      {
        "name": "is_active",
        "type": "core::bool"
      }
    ]
  },
  {
    "name": "tbamarketplace::base::types::Bid",
    "type": "struct",
    "members": [
      {
        "name": "bid_id",
        "type": "core::integer::u256"
      },
      {
        "name": "bidder",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "amount",
        "type": "core::integer::u256"
      },
      {
        "name": "is_active",
        "type": "core::bool"
      }
    ]
  },
  {
    "name": "tbamarketplace::interfaces::ITBAMarketplace::ITBAMarketplace",
    "type": "interface",
    "items": [
      {
        "name": "get_name",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::byte_array::ByteArray"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "get_listings",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::array::Array::<tbamarketplace::base::types::Listing>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "get_listing",
        "type": "function",
        "inputs": [
          {
            "name": "listing_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "tbamarketplace::base::types::Listing"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "get_bids",
        "type": "function",
        "inputs": [
          {
            "name": "listing_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::array::Array::<tbamarketplace::base::types::Bid>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "get_bid",
        "type": "function",
        "inputs": [
          {
            "name": "listing_id",
            "type": "core::integer::u256"
          },
          {
            "name": "bid_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "tbamarketplace::base::types::Bid"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "list_tba",
        "type": "function",
        "inputs": [
          {
            "name": "tba_address",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "external"
      },
      {
        "name": "place_bid",
        "type": "function",
        "inputs": [
          {
            "name": "listing_id",
            "type": "core::integer::u256"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "accept_bid",
        "type": "function",
        "inputs": [
          {
            "name": "listing_id",
            "type": "core::integer::u256"
          },
          {
            "name": "bid_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "cancel_listing",
        "type": "function",
        "inputs": [
          {
            "name": "listing_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "cancel_bid",
        "type": "function",
        "inputs": [
          {
            "name": "listing_id",
            "type": "core::integer::u256"
          },
          {
            "name": "bid_index",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      }
    ]
  },
  {
    "name": "constructor",
    "type": "constructor",
    "inputs": []
  },
  {
    "kind": "struct",
    "name": "tbamarketplace::base::types::TBAListed",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "listing_id",
        "type": "core::integer::u256"
      },
      {
        "kind": "data",
        "name": "seller",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "nft_contract_address",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "amount",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "tbamarketplace::base::types::BidPlaced",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "bid_id",
        "type": "core::integer::u256"
      },
      {
        "kind": "data",
        "name": "nft_address",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "bidder",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "amount",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "tbamarketplace::tba_marketplace::tba_marketplace::TBAMarketplace::Event",
    "type": "event",
    "variants": [
      {
        "kind": "nested",
        "name": "TBAListed",
        "type": "tbamarketplace::base::types::TBAListed"
      },
      {
        "kind": "nested",
        "name": "BidPlaced",
        "type": "tbamarketplace::base::types::BidPlaced"
      }
    ]
  }
]