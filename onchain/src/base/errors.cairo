pub mod Errors {
    pub const ZERO_ADDRESS_CALLER: felt252 = 'Caller cannot be zero addr';
    pub const ZERO_BID_AMOUNT: felt252 = 'Bid must be greater than 0';
    pub const INACTIVE_LISTING: felt252 = 'Listing not active';
    pub const INVALID_LISTING_OWNER: felt252 = 'Caller must be the seller';
    pub const INVALID_BID_OWNER: felt252 = 'Only the bidder can cancel bid';
    pub const TBA_LOCKED: felt252 = 'Account is locked';
    pub const CALLER_NOT_OWNER: felt252 = 'Caller not owner';
    pub const INVALID_SPENDING_ALLOWANCE: felt252 = 'Invalid spending allowance';
}
