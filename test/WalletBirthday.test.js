/**
 * WalletBirthday Smart Contract Test Suite
 * Tests all contract functions for correctness and security
 */
import { expect } from "chai";

describe("WalletBirthday", function () {
  let walletBirthday;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    const WalletBirthday = await ethers.getContractFactory("WalletBirthday");
    [owner, addr1, addr2] = await ethers.getSigners();
    walletBirthday = await WalletBirthday.deploy();
    await walletBirthday.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await walletBirthday.name()).to.equal("Wallet Birthday");
      expect(await walletBirthday.symbol()).to.equal("WBDAY");
    });

    it("Should start with tokenIdCounter at 0", async function () {
      expect(await walletBirthday.totalSupply()).to.equal(0);
    });

    it("Should set owner correctly", async function () {
      expect(await walletBirthday.owner()).to.equal(owner.address);
    });
  });

  describe("Minting", function () {
    it("Should mint with valid data", async function () {
      const timestamp = Math.floor(Date.now() / 1000) - 86400 * 100; // 100 days ago
      const uri = "https://example.com/metadata/1.json";

      const tx = await walletBirthday.connect(addr1).mintBirthday(timestamp, 100, uri);
      const receipt = await tx.wait();

      // Check BirthdayMinted event was emitted (find it in logs)
      const birthdayMintedEvent = receipt.logs.find(log => log.fragment?.name === "BirthdayMinted");
      expect(birthdayMintedEvent).to.not.be.undefined;
      expect(birthdayMintedEvent.args.minter).to.equal(addr1.address);
      expect(birthdayMintedEvent.args.ageInDays).to.equal(100);

      // Check token was minted
      expect(await walletBirthday.ownerOf(1)).to.equal(addr1.address);
      expect(await walletBirthday.totalSupply()).to.equal(1);
      expect(await walletBirthday.hasMinted(addr1.address)).to.equal(true);
    });

    it("Should reject empty URI", async function () {
      const timestamp = Math.floor(Date.now() / 1000) - 86400;
      await expect(
        walletBirthday.connect(addr1).mintBirthday(timestamp, 100, "")
      ).to.be.revertedWith("URI cannot be empty");
    });

    it("Should reject URI too long (>500 chars)", async function () {
      const timestamp = Math.floor(Date.now() / 1000) - 86400;
      const longUri = "https://example.com/" + "a".repeat(500);
      await expect(
        walletBirthday.connect(addr1).mintBirthday(timestamp, 100, longUri)
      ).to.be.revertedWith("URI too long");
    });

    it("Should reject invalid URI scheme", async function () {
      const timestamp = Math.floor(Date.now() / 1000) - 86400;
      await expect(
        walletBirthday.connect(addr1).mintBirthday(timestamp, 100, "ftp://example.com")
      ).to.be.revertedWith("Invalid URI scheme");
    });

    it("Should accept ipfs:// URIs", async function () {
      const timestamp = Math.floor(Date.now() / 1000) - 86400;
      const uri = "ipfs://QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
      
      await walletBirthday.connect(addr1).mintBirthday(timestamp, 100, uri);
      expect(await walletBirthday.hasMinted(addr1.address)).to.equal(true);
    });

    it("Should reject future timestamp", async function () {
      const futureTimestamp = Math.floor(Date.now() / 1000) + 86400;
      const uri = "https://example.com/metadata/1.json";
      
      await expect(
        walletBirthday.connect(addr1).mintBirthday(futureTimestamp, 100, uri)
      ).to.be.revertedWith("Timestamp cannot be in future");
    });

    it("Should reject zero timestamp", async function () {
      const uri = "https://example.com/metadata/1.json";
      await expect(
        walletBirthday.connect(addr1).mintBirthday(0, 100, uri)
      ).to.be.revertedWith("Invalid timestamp");
    });

    it("Should reject zero age", async function () {
      const timestamp = Math.floor(Date.now() / 1000) - 86400;
      const uri = "https://example.com/metadata/1.json";
      await expect(
        walletBirthday.connect(addr1).mintBirthday(timestamp, 0, uri)
      ).to.be.revertedWith("Invalid age");
    });

    it("Should reject unrealistic age (>100000 days)", async function () {
      // Use a recent timestamp but an age that exceeds the limit
      // Age of 200000 days (about 548 years) is clearly unrealistic
      const timestamp = Math.floor(Date.now() / 1000) - 86400 * 10; // 10 days ago
      const uri = "https://example.com/metadata/1.json";
      await expect(
        walletBirthday.connect(addr1).mintBirthday(timestamp, 200000, uri)
      ).to.be.revertedWith("Age unrealistic");
    });

    it("Should prevent double minting", async function () {
      const timestamp = Math.floor(Date.now() / 1000) - 86400;
      const uri = "https://example.com/metadata/1.json";

      await walletBirthday.connect(addr1).mintBirthday(timestamp, 100, uri);
      await expect(
        walletBirthday.connect(addr1).mintBirthday(timestamp, 100, uri)
      ).to.be.revertedWith("Already minted");
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      const timestamp = Math.floor(Date.now() / 1000) - 86400 * 100;
      await walletBirthday.connect(addr1).mintBirthday(timestamp, 100, "https://example.com/1.json");
    });

    it("Should return birthday data correctly", async function () {
      const birthday = await walletBirthday.getBirthdayByWallet(addr1.address);
      expect(birthday.ageInDays).to.equal(100);
    });

    it("Should throw when wallet has no birthday", async function () {
      await expect(
        walletBirthday.getBirthdayByWallet(addr2.address)
      ).to.be.revertedWith("No birthday found");
    });

    it("Should return correct tokenURI", async function () {
      // Owner can view their own tokenURI
      const uri = await walletBirthday.connect(addr1).tokenURI(1);
      expect(uri).to.equal("https://example.com/1.json");
    });
  });

  describe("Owner Functions", function () {
    beforeEach(async function () {
      const timestamp = Math.floor(Date.now() / 1000) - 86400;
      await walletBirthday.connect(addr1).mintBirthday(timestamp, 100, "https://example.com/1.json");
    });

    it("Should allow owner to update URI", async function () {
      const newUri = "ipfs://QmNewHash123";
      await walletBirthday.connect(owner).updateURI(1, newUri);
      const birthday = await walletBirthday.getBirthdayByWallet(addr1.address);
      expect(birthday.metadataURI).to.equal(newUri);
    });

    it("Should reject non-owner from updating URI", async function () {
      await expect(
        walletBirthday.connect(addr2).updateURI(1, "https://new.com/uri")
      ).to.be.revertedWithCustomError(walletBirthday, "OwnableUnauthorizedAccount");
    });

    it("Should allow owner to emergency transfer", async function () {
      await walletBirthday.connect(owner).emergencyTransfer(addr1.address, addr2.address, 1);
      expect(await walletBirthday.ownerOf(1)).to.equal(addr2.address);
    });

    it("Should reject non-owner from emergency transfer", async function () {
      await expect(
        walletBirthday.connect(addr2).emergencyTransfer(addr1.address, addr2.address, 1)
      ).to.be.revertedWithCustomError(walletBirthday, "OwnableUnauthorizedAccount");
    });

    it("Should reject emergency transfer to zero address", async function () {
      await expect(
        walletBirthday.connect(owner).emergencyTransfer(addr1.address, "0x0000000000000000000000000000000000000000", 1)
      ).to.be.revertedWith("Invalid recipient");
    });

    it("Should allow owner to withdraw", async function () {
      // Fund the contract by sending ETH directly to its address
      // Use hardhat setBalance or fund via coinbase
      const contractAddress = await walletBirthday.getAddress();
      
      // Set the balance of the contract directly via hardhat network
      await ethers.provider.send("hardhat_setBalance", [
        contractAddress,
        "0xDE0B6B3A7640000" // 1 ETH in hex
      ]);

      const ownerBalance = await ethers.provider.getBalance(owner.address);
      await walletBirthday.connect(owner).withdraw();
      const newBalance = await ethers.provider.getBalance(owner.address);
      expect(newBalance > ownerBalance).to.be.true;
    });

    it("Should reject non-owner from withdraw", async function () {
      await expect(
        walletBirthday.connect(addr1).withdraw()
      ).to.be.revertedWithCustomError(walletBirthday, "OwnableUnauthorizedAccount");
    });
  });

  describe("Events", function () {
    it("Should emit BirthdayMinted event", async function () {
      const timestamp = Math.floor(Date.now() / 1000) - 86400;
      const uri = "https://example.com/metadata/1.json";

      await expect(walletBirthday.connect(addr1).mintBirthday(timestamp, 100, uri))
        .to.emit(walletBirthday, "BirthdayMinted")
        .withArgs(addr1.address, 1, timestamp, 100);
    });

    it("Should emit EmergencyTransfer event", async function () {
      const timestamp = Math.floor(Date.now() / 1000) - 86400;
      await walletBirthday.connect(addr1).mintBirthday(timestamp, 100, "https://example.com/1.json");

      await expect(
        walletBirthday.connect(owner).emergencyTransfer(addr1.address, addr2.address, 1)
      )
        .to.emit(walletBirthday, "EmergencyTransfer")
        .withArgs(1, addr1.address, addr2.address);
    });
  });
});
