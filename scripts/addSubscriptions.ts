import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const SubscribeToPrice = await ethers.getContractFactory("SubscribeToPrice");
  const contract = SubscribeToPrice.attach(
    "0xaB17834feb6F2597923bA6081668941f740E0BF2"
  );

  const options = { value: ethers.utils.parseEther("0.5") };
  const receipt = await contract.registerSubscription(
    "0x651071f8c7ab2321b6bdd3bc79b94a50841a92a6e065f9e3b8b9926a8fb5a5d1",
    ethers.utils.parseEther("0.001"),
    false,
    true,
    0,
    5000,
    options
  );
  console.log(receipt);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
