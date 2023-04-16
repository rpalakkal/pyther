import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const SubscribeToPrice = await ethers.getContractFactory("SubscribeToPrice");
  const subscribeToPrice = await SubscribeToPrice.deploy("0xff1a0f4744e8582DF1aE09D5611b887B6a12925C");

  await subscribeToPrice.deployed();
  console.log("SubscribeToPrice deployed to:", subscribeToPrice.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
