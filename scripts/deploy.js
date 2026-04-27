/**
 * Deployment Script for WalletBirthday Contract
 * Usage: npx hardhat run scripts/deploy.js --network base
 */
import hre from "hardhat";

async function main() {
  const WalletBirthday = await hre.ethers.getContractFactory("WalletBirthday");
  const walletBirthday = await WalletBirthday.deploy();
  
  await walletBirthday.waitForDeployment();
  
  const address = await walletBirthday.getAddress();
  console.log("WalletBirthday deployed to:", address);
  
  // Verify on Basescan (if API key is set)
  if (process.env.BASESCAN_API_KEY) {
    try {
      await hre.run("verify:verify", {
        address: address,
        constructorArguments: [],
      });
      console.log("Contract verified on Basescan");
    } catch (error) {
      console.log("Verification failed (Basescan may not support this network):", error.message);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
