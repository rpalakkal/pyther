import { EvmPriceServiceConnection } from "@pythnetwork/pyth-evm-js";
import { ethers } from "hardhat";
import IPythAbi from "@pythnetwork/pyth-sdk-solidity/abis/IPyth.json";
import Web3 from "web3";

const connection = new EvmPriceServiceConnection(
  "https://xc-testnet.pyth.network"
);

const shouldUpdate = (
  isTime: boolean,
  isPrice: boolean,
  timestamp: number,
  lastTimestamp: number,
  timestampInterval: number,
  price: number,
  lastPrice: number,
  priceInterval: number
) => {
  let result = true;
  if (isTime) {
    if (timestamp - lastTimestamp < timestampInterval) {
      result = false;
    }
  }
  if (isPrice) {
    if (Math.abs((100 * (price - lastPrice)) / price) < priceInterval) {
      result = false;
    }
  }
  return result;
};

async function main() {
  const SubscribeToPrice = await ethers.getContractFactory("SubscribeToPrice");
  const contract = SubscribeToPrice.attach(
    "0xaB17834feb6F2597923bA6081668941f740E0BF2"
  );

  const btcSubscriptions = await contract.viewSubscriptions(
    "0xf9c0172ba10dfa4d19088d94f5bf61d3b54d5bd7483a322a982e1373ee8ea31b"
  );
  console.log(btcSubscriptions);

  const pythContract = new ethers.Contract(
    "0xff1a0f4744e8582DF1aE09D5611b887B6a12925C",
    IPythAbi,
    ethers.provider
  );

  const price = await pythContract.getPrice(
    "0x19786f31e85d3598cecdab810b2787de0fc22c2cf98b4f16fb1e5bf567a0a431"
  );
  //   const price = 19000; //for demo
  const priceUpdateData = await connection.getPriceFeedsUpdateData([
    "0xf9c0172ba10dfa4d19088d94f5bf61d3b54d5bd7483a322a982e1373ee8ea31b",
  ]);

  let indices = [];
  for (let i = 0; i < btcSubscriptions.length; i++) {
    const subscription = btcSubscriptions[i];
    const ready = shouldUpdate(
      subscription.update.isTime,
      subscription.update.isPrice,
      10,
      price.publishTime,
      Number(subscription.update.timeDifference),
      price.price,
      price.price,
      Number(subscription.update.priceDifference)
    );
    if (ready) {
      indices.push(i);
    }
  }
  contract.submitUpdate(
    priceUpdateData,
    ["0xf9c0172ba10dfa4d19088d94f5bf61d3b54d5bd7483a322a982e1373ee8ea31b"],
    [indices]
  );
}

const interval = setInterval(() => {
    main().catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
}, 1000);

clearInterval(interval);