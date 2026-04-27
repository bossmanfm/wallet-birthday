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

1. Install Hardhat dependencies:
   ```bash
   npm install -D @nomicfoundation/hardhat-toolbox
   ```

2. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env with your keys
   ```

3. Deploy to Base:
   ```bash
   npx hardhat run scripts/deploy.js --network base
   ```

4. Update `src/contracts/config.js` with the deployed address.

### Contract Address (Update after deployment)

**Current Placeholder:** `0x1234567890123456789012345678901234567890`

**Deployed Address:** [To be added after deployment]

### Contract Functions

- `mintBirthday(uint256 firstTxTimestamp, uint256 ageInDays, string memory uri)` - Mint NFT badge
- `hasMinted(address wallet)` - Check if wallet has minted
- `tokenURI(uint256 tokenId)` - Get token metadata
- `emergencyTransfer(address from, address to, uint256 tokenId)` - Owner-only: recover lost NFTs
- `updateURI(uint256 tokenId, string memory newUri)` - Owner-only: fix broken metadata
- `withdraw()` - Owner-only: withdraw accidental ETH
- `totalSupply()` - Get total minted count
- `getBirthdayByWallet(address wallet)` - Get birthday data by wallet

## 🔒 Security Features

### Input Validation
- ✅ URI validation (length 1-500 chars, scheme check for http/https/ipfs)
- ✅ Timestamp validation (cannot be future date, must be > 0)
- ✅ Age validation (1-100,000 days, max ~274 years)
- ✅ One NFT per wallet limit (double mint prevention)
- ✅ Max supply cap (1,000,000 tokens)

### Access Control
- ✅ Ownable pattern (OpenZeppelin) for all admin functions
- ✅ Emergency transfer function (owner only, for lost wallet recovery)
- ✅ URI update function (owner only, for fixing broken metadata)
- ✅ Withdraw function (owner only, for accidental ETH recovery)

### Best Practices
- ✅ Using OpenZeppelin audited libraries (ERC721, Ownable)
- ✅ Solidity 0.8.20 (built-in overflow protection)
- ✅ Events emitted for all state changes
- ✅ Reentrancy-safe (no external calls in mint function)
- ✅ Integer overflow protection (built-in Solidity 0.8+)

### Known Limitations
- Metadata hosted off-chain (recommend IPFS for production)
- No multi-sig for owner functions
- Owner has significant power (emergency transfer, URI update)

### Recommendations for Production
1. Use multi-sig wallet for owner functions
2. Host metadata on IPFS (decentralized)
3. Consider adding timelock for admin functions
4. Get professional audit before mainnet launch

## Usage

1. Connect your wallet
2. Click "Find My Wallet Birthday"
3. View your wallet's birthday card
4. Download PNG or Mint as NFT

## Build

```bash
npm run build
```

## Testing

```bash
npm install -D @nomicfoundation/hardhat-toolbox
npx hardhat test
```

## License

MIT

## Architecture

### Frontend
- **Framework**: React with Vite
- **State Management**: React hooks
- **Wallet Integration**: wagmi + viem
- **Styling**: CSS with custom theme
- **Image Generation**: html-to-image

### Smart Contract
- **Standard**: ERC721 (NFT)
- **Network**: Base (Ethereum L2)
- **Access Control**: OpenZeppelin Ownable
- **Development**: Hardhat

### Scanning Algorithm
- **Method**: Binary search on public RPC
- **Optimization**: Etherscan API (optional)
- **Multi-chain**: Scans across multiple networks

## Project Structure

```
wallet-birthday/
├── contracts/
│   └── WalletBirthday.sol    # Smart contract
├── scripts/
│   └── deploy.js             # Deployment script
├── test/
│   └── WalletBirthday.test.js # Test suite
├── src/
│   ├── components/           # React components
│   ├── contracts/            # Contract config & ABI
│   ├── utils/                # Utility functions
│   ├── styles/               # CSS stylesheets
│   ├── App.jsx               # Main app component
│   └── main.jsx              # Entry point
├── public/                   # Static assets
└── docs/                     # Documentation
```

## Smart Contract API

### View Functions
| Function | Description |
|----------|-------------|
| `hasMinted(address)` | Check if wallet has minted |
| `tokenURI(uint256)` | Get token metadata URI |
| `totalSupply()` | Get total minted count |
| `getBirthdayByWallet(address)` | Get birthday data |

### Write Functions
| Function | Description |
|----------|-------------|
| `mintBirthday(timestamp, age, uri)` | Mint NFT badge |
| `updateURI(tokenId, uri)` | Update token URI (owner) |
| `emergencyTransfer(from, to, tokenId)` | Recover NFT (owner) |
| `withdraw()` | Withdraw ETH (owner) |

## Deployment Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your keys
```

### 3. Run Tests
```bash
npx hardhat test
```

### 4. Deploy Contract
```bash
npx hardhat run scripts/deploy.js --network base
```

### 5. Update Config
Update `src/contracts/config.js` with deployed address.

### 6. Build Frontend
```bash
npm run build
```

### 7. Deploy Frontend
Deploy `dist/` folder to Vercel or any static host.

## FAQ

### How does the wallet birthday finder work?
It uses binary search on the blockchain to find the first transaction associated with your wallet address across multiple chains.

### Is it free to mint?
You only pay gas fees on Base network, which are typically very low (<$0.01).

### Can I mint for someone else's wallet?
Yes, you can look up any wallet's birthday, but you need to connect a wallet to mint.

### What if I minted on the wrong network?
The NFT is minted on Base mainnet. If you need help, contact the maintainer.

### Why can't I find my wallet birthday?
Your wallet might not have any on-chain activity yet. Make a transaction first.

## License

MIT License - see LICENSE file for details.
