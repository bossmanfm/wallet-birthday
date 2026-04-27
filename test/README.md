# Test Suite Documentation

## Running Tests

```bash
npx hardhat test
```

## Test Coverage

The test suite covers:
- Minting functionality
- URI validation
- Timestamp validation
- Age validation
- Supply cap enforcement
- One NFT per wallet limit
- Emergency transfer (owner only)
- URI update (owner only)
- Withdraw function (owner only)
- Ownership transfer

## Adding New Tests

1. Create test file in `test/` directory
2. Use `describe` blocks for feature grouping
3. Use `it` blocks for individual test cases
4. Use `expect` for assertions

## Test Categories

| Category | Files | Description |
|----------|-------|-------------|
| Contract | WalletBirthday.test.js | Smart contract tests |
| Utils | (future) | Utility function tests |
| Components | (future) | React component tests |
