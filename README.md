# 🎂 Wallet Birthday

Discover when your wallet was born and mint it as an NFT badge!

**Live App:** https://wallet-birthday.vercel.app

## Features

- 🔗 Connect wallet (MetaMask, Rabby, etc.)
- 🔍 Find first transaction using binary search on public RPC
- 📋 Beautiful birthday card showing wallet age
- 📥 Download birthday card as PNG
- 🖼️ Mint as NFT badge on Base

## Tech Stack

- **Frontend:** Vite + React
- **Wallet:** wagmi + viem
- **NFT:** ERC721 on Base
- **Image:** html-to-image
- **Deploy:** Vercel

## Setup

```bash
npm install
npm run dev
```

### Get Etherscan API Key (Optional but Recommended)

For faster Ethereum scanning, get a free Etherscan API key:

1. Go to https://etherscan.io/myapikey
2. Sign up/Login
3. Create API Key Token (free)
4. Add key to `.env` file:
   ```
   VITE_ETHERSCAN_API_KEY=your_api_key_here
   ```

**Rate Limits:**
- Without API key: 1 call/sec
- With free API key: 5 calls/sec

## Smart Contract Deployment

The smart contract `contracts/WalletBirthday.sol` needs to be deployed to Base mainnet.

### Steps:

1. Go to [Remix IDE](https://remix.ethereum.org/)
2. Create a new file and paste the contract from `contracts/WalletBirthday.sol`
3. Compile with Solidity 0.8.20
4. Deploy using Injected Provider (MetaMask) on Base network
5. Copy the deployed contract address
6. Update `src/contracts/config.js` with the new address:
   ```javascript
   export const CONTRACT_ADDRESS = "YOUR_DEPLOYED_ADDRESS_HERE";
   ```

### Contract Address (Update after deployment)

**Current Placeholder:** `0x1234567890123456789012345678901234567890`

**Deployed Address:** [To be added after deployment]

### Contract Functions

- `mintBirthday(uint256 firstTxTimestamp, uint256 ageInDays, string memory uri)` - Mint NFT badge
- `hasMinted(address wallet)` - Check if wallet has minted
- `tokenURI(uint256 tokenId)` - Get token metadata

## Usage

1. Connect your wallet
2. Click "Find My Wallet Birthday"
3. View your wallet's birthday card
4. Download PNG or Mint as NFT

## Build

```bash
npm run build
```

## License

MIT
