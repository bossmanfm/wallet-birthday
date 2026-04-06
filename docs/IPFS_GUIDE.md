# IPFS Metadata Upload Guide

## Why IPFS?

IPFS ensures your NFT metadata is:
- **Decentralized** - no single point of failure
- **Permanent** - won't disappear if server goes down
- **Content-addressed** - immutable (hash-based addressing)

## Option 1: Pinata (Free Tier Recommended)

1. Sign up: https://pinata.cloud
2. Get API keys from dashboard (JWT token)
3. Upload metadata JSON:

```javascript
const metadata = {
  name: "Wallet Birthday #123",
  description: "My wallet was born on Ethereum 812 days ago!",
  image: "ipfs://QmYourImageHash",
  attributes: [
    { trait_type: "Chain", value: "Ethereum" },
    { trait_type: "Age", value: "812 days" },
    { trait_type: "Birthday", value: "2023-01-15" }
  ]
};

// Upload to Pinata via their API
const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${PINATA_JWT}`
  },
  body: JSON.stringify({
    pinataContent: metadata,
    pinataMetadata: { name: "wallet-birthday-123.json" }
  })
});
const { IpfsHash } = await response.json();
// Use: ipfs://${IpfsHash}
```

4. Get IPFS hash (CID)
5. Use `ipfs://QmYourHash` as URI in mint function

## Option 2: NFT.Storage (Free)

1. Go to https://nft.storage
2. Connect wallet (GitHub or email)
3. Upload metadata via dashboard or API
4. Get IPFS URI automatically

## Option 3: Local IPFS Node

```bash
# Install IPFS
brew install ipfs  # macOS
# or: https://docs.ipfs.io/install/

# Initialize
ipfs init

# Start daemon
ipfs daemon

# Upload file
ipfs add metadata.json
# Returns: QmYourHash... (the CID)

# Access via gateway
# https://ipfs.io/ipfs/QmYourHash...
```

## Metadata JSON Schema

```json
{
  "name": "Wallet Birthday #123",
  "description": "This wallet was born on Ethereum 812 days ago! First transaction: 2021-03-15",
  "image": "ipfs://QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "attributes": [
    {
      "trait_type": "Chain",
      "value": "Ethereum"
    },
    {
      "trait_type": "Age (Days)",
      "value": 812
    },
    {
      "trait_type": "First Transaction",
      "value": "2021-03-15"
    },
    {
      "trait_type": "Birthday",
      "display_type": "date",
      "value": 1615785600
    }
  ]
}
```

## URI Formats Supported

| Type | Example |
|------|---------|
| IPFS | `ipfs://Qm...` |
| HTTP | `https://example.com/metadata/123.json` |
| HTTPS | `https://cloudflare-ipfs.com/ipfs/Qm...` |

## Public IPFS Gateways

- https://ipfs.io/ipfs/
- https://cloudflare-ipfs.com/ipfs/
- https://gateway.pinata.cloud/ipfs/
- https://dweb.link/ipfs/

## Important Notes

1. **Never use raw `ipfs add` without pinning** - your data will be garbage collected!
2. **Use a pinning service** (Pinata, NFT.Storage, Filecoin) for persistence
3. **Test your URIs** before minting - verify they resolve correctly
4. **Consider image hosting too** - the `image` field should also be on IPFS or a reliable CDN
