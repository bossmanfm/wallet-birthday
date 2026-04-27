# Contributing to Wallet Birthday

Thank you for your interest in contributing!

## Getting Started

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Setup

```bash
npm install
npm run dev
```

## Contract Development

```bash
npm install -D @nomicfoundation/hardhat-toolbox
npx hardhat test
npx hardhat run scripts/deploy.js --network base
```

## Code Style

- Follow existing code conventions
- Use meaningful commit messages
- Keep PRs focused and small

## Reporting Issues

Please include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
