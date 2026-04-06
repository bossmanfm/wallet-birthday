// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WalletBirthday is ERC721, Ownable {
    struct Birthday {
        uint256 firstTxTimestamp;
        uint256 ageInDays;
        string metadataURI;
    }
    
    mapping(address => uint256) public walletToTokenId;
    mapping(uint256 => Birthday) public birthdays;
    uint256 public tokenIdCounter;
    
    constructor() ERC721("Wallet Birthday", "WBDAY") Ownable(msg.sender) {}
    
    function mintBirthday(
        uint256 firstTxTimestamp,
        uint256 ageInDays,
        string memory uri
    ) public returns (uint256) {
        require(walletToTokenId[msg.sender] == 0, "Already minted");
        
        uint256 tokenId = ++tokenIdCounter;
        _mint(msg.sender, tokenId);
        
        walletToTokenId[msg.sender] = tokenId;
        birthdays[tokenId] = Birthday(firstTxTimestamp, ageInDays, uri);
        
        return tokenId;
    }
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(ownerOf(tokenId) == msg.sender, "Not your token");
        return birthdays[tokenId].metadataURI;
    }
    
    function getBirthdayByWallet(address wallet) public view returns (Birthday memory) {
        uint256 tokenId = walletToTokenId[wallet];
        require(tokenId > 0, "No birthday found");
        return birthdays[tokenId];
    }
    
    function hasMinted(address wallet) public view returns (bool) {
        return walletToTokenId[wallet] > 0;
    }
}
