# Smart Contract Documentation

## Overview

WalletBirthday is an ERC721 NFT contract that mints birthday badges for crypto wallets.

## Contract Details

- **Standard**: ERC721 (OpenZeppelin)
- **Network**: Base (Chain ID: 8453)
- **Max Supply**: 1,000,000 tokens
- **Access Control**: Ownable (OpenZeppelin)

## Functions

### mintBirthday
```solidity
function mintBirthday(uint256 firstTxTimestamp, uint256 ageInDays, string memory uri) external
```
Mints a new birthday NFT badge. Each wallet can only mint once.

### hasMinted
```solidity
function hasMinted(address wallet) external view returns (bool)
```
Returns whether a wallet has already minted.

### tokenURI
```solidity
function tokenURI(uint256 tokenId) external view returns (string memory)
```
Returns the metadata URI for a token.

### totalSupply
```solidity
function totalSupply() external view returns (uint256)
```
Returns the total number of minted tokens.

### getBirthdayByWallet
```solidity
function getBirthdayByWallet(address wallet) external view returns (uint256, uint256)
```
Returns the birthday data for a wallet.

### emergencyTransfer (owner only)
```solidity
function emergencyTransfer(address from, address to, uint256 tokenId) external onlyOwner
```
Transfers an NFT in case of lost wallet recovery.

### updateURI (owner only)
```solidity
function updateURI(uint256 tokenId, string memory newUri) external onlyOwner
```
Updates the metadata URI for a token.

### withdraw (owner only)
```solidity
function withdraw() external onlyOwner
```
Withdraws any accidentally sent ETH.

## Events

- `BirthdayMinted(address minter, uint256 tokenId, uint256 timestamp)`
- `EmergencyTransfer(address from, address to, uint256 tokenId)`
