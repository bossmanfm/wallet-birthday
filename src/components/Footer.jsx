/**
 * Footer Component
 * Displays app credits and links
 * 
 * Props: None
 * Returns: JSX footer element
 */
export function Footer() {
  return (
    <footer className="footer">
      <p>
        Built with ❤️ on <a href="https://base.org" target="_blank" rel="noopener noreferrer">Base</a>
      </p>
      <p className="footer-links">
        <a href="https://github.com/bossmanfm/wallet-birthday" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        {' • '}
        <a href="https://walletbirthday.xyz" target="_blank" rel="noopener noreferrer">
          WalletBirthday.xyz
        </a>
      </p>
    </footer>
  );
}
