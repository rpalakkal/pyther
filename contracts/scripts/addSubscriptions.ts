import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const SubscribeToPrice = await ethers.getContractFactory("SubscribeToPrice");
  const contract = SubscribeToPrice.attach(
    "0xaB17834feb6F2597923bA6081668941f740E0BF2"
  );

  const options = { value: ethers.utils.parseEther("0.5") };
  const receipt = await contract.registerSubscription(
    "0xf9c0172ba10dfa4d19088d94f5bf61d3b54d5bd7483a322a982e1373ee8ea31b",
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
