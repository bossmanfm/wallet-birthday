# Deployment Checklist

## Pre-Deployment

- [ ] All tests pass (`npx hardhat test`)
- [ ] Contract compiles without warnings
- [ ] README is up to date
- [ ] .env file configured with all required variables
- [ ] Deployer wallet has sufficient ETH on Base
- [ ] Contract address updated in frontend config

## Deployment Steps

1. Run `npx hardhat run scripts/deploy.js --network base`
2. Copy deployed contract address
3. Update `src/contracts/config.js` with new address
4. Run `npm run build`
5. Deploy `dist/` to Vercel

## Post-Deployment

- [ ] Verify contract on Basescan
- [ ] Test minting on production
- [ ] Test emergency functions
- [ ] Verify frontend works with new contract
- [ ] Update social links if domain changed
