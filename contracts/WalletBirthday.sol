// SPDX-License-Identifier: MIT
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WalletBirthday is ERC721, Ownable {
    // Max supply for collection cap
    uint256 public constant MAX_SUPPLY = 1000000;
    
    struct Birthday {
        uint256 firstTxTimestamp;
        uint256 ageInDays;
        string metadataURI;
    }
    
    mapping(address => uint256) public walletToTokenId;
    mapping(uint256 => Birthday) public birthdays;
    uint256 public tokenIdCounter;
    
    // Events for better tracking
    event BirthdayMinted(
        address indexed minter,
        uint256 indexed tokenId,
        uint256 firstTxTimestamp,
        uint256 ageInDays
    );
    event EmergencyTransfer(
        uint256 indexed tokenId,
        address from,
        address to
    );
    
    constructor() ERC721("Wallet Birthday", "WBDAY") Ownable(msg.sender) {}
    
    /**
     * @dev Mint birthday NFT with comprehensive validation
     */
    /// @notice Mint a birthday NFT badge for the caller
    /// @param firstTxTimestamp The timestamp of the first transaction
    /// @param ageInDays The age of the wallet in days
    /// @param uri The metadata URI for the NFT
    function mintBirthday(
        uint256 firstTxTimestamp,
        uint256 ageInDays,
        string memory uri
    ) public returns (uint256) {
        // Security: Prevent double mint
        require(walletToTokenId[msg.sender] == 0, "Already minted");
        
        // Security: Max supply cap
        require(tokenIdCounter < MAX_SUPPLY, "Max supply reached");
        
        // Security: URI validation (CRITICAL FIX)
        require(bytes(uri).length > 0, "URI cannot be empty");
        require(bytes(uri).length <= 500, "URI too long");
        // Check for valid URI schemes: http, https, ipfs
        require(
            bytes(uri)[0] == 'h' || // http/https
            bytes(uri)[0] == 'i',   // ipfs
            "Invalid URI scheme"
        );
        
        // Security: Timestamp validation (MEDIUM FIX)
        require(firstTxTimestamp > 0, "Invalid timestamp");
        require(firstTxTimestamp <= block.timestamp, "Timestamp cannot be in future");
        require(ageInDays > 0, "Invalid age");
        require(ageInDays <= 100000, "Age unrealistic"); // Max ~274 years
        
        uint256 tokenId = ++tokenIdCounter;
        _mint(msg.sender, tokenId);
        
        walletToTokenId[msg.sender] = tokenId;
        birthdays[tokenId] = Birthday(firstTxTimestamp, ageInDays, uri);
        
        emit BirthdayMinted(msg.sender, tokenId, firstTxTimestamp, ageInDays);
        
        return tokenId;
    }
    
    /**
     * @dev Emergency transfer function for lost wallet recovery
     * Only owner can call this
     */
    /// @notice Emergency transfer of NFT to recover lost wallet
    /// @param from Original owner address
    /// @param to New owner address
    /// @param tokenId The token ID to transfer
    function emergencyTransfer(
        address from,
        address to,
        uint256 tokenId
    ) external onlyOwner {
        require(to != address(0), "Invalid recipient");
        require(ownerOf(tokenId) == from, "From is not owner");
        
        _transfer(from, to, tokenId);
        
        emit EmergencyTransfer(tokenId, from, to);
    }
    
    /**
     * @dev Update URI for specific token (owner only)
     * For fixing broken metadata
     */
    /// @notice Update the metadata URI for a token
    /// @param tokenId The token ID to update
    /// @param newUri The new metadata URI
    function updateURI(
        uint256 tokenId,
        string memory newUri
    ) external onlyOwner {
        require(bytes(newUri).length > 0, "URI cannot be empty");
        require(bytes(newUri).length <= 500, "URI too long");
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        
        birthdays[tokenId].metadataURI = newUri;
    }
    
    /**
     * @dev Get birthday info by wallet address
     */
    function getBirthdayByWallet(address wallet) public view returns (Birthday memory) {
        uint256 tokenId = walletToTokenId[wallet];
        require(tokenId > 0, "No birthday found");
        return birthdays[tokenId];
    }
    
    /**
     * @dev Check if wallet has minted
     */
    /// @notice Check if a wallet has already minted a badge
    /// @param wallet The address to check
    /// @return True if the wallet has minted
    function hasMinted(address wallet) public view returns (bool) {
        return walletToTokenId[wallet] > 0;
    }
    
    /**
     * @dev Get total supply
     */
    /// @notice Get the total number of minted badges
    /// @return The total supply
    function totalSupply() public view returns (uint256) {
        return tokenIdCounter;
    }
    
    /**
     * @dev Override tokenURI to return stored URI
     */
    /// @notice Get the metadata URI for a token
    /// @param tokenId The token ID
    /// @return The metadata URI
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(ownerOf(tokenId) == msg.sender || ownerOf(tokenId) != address(0), "Not your token");
        return birthdays[tokenId].metadataURI;
    }
    
    /**
     * @dev Withdraw function for any ETH sent to contract accidentally
     * Only owner can call
     */
    /// @notice Withdraw accidentally sent ETH from the contract
    function withdraw() external onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        require(success, "Withdraw failed");
    }
}
