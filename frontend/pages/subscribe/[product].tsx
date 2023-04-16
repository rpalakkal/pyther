import Base from "@/components/Base";
import Switch from "@/components/Switch";
import { useRouter } from "next/router";
import { useState } from "react";
import { ethers } from "ethers";
import { abi } from "../../../contracts/artifacts/contracts/SubscribeToPrice.sol/SubscribeToPrice.json";

const symbolToId: { [symbol: string]: string } = {
  BTCUSD: "0xf9c0172ba10dfa4d19088d94f5bf61d3b54d5bd7483a322a982e1373ee8ea31b",
  ETHUSD: "0xca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a6",
  SOLUSD: "0xfe650f0367d4a7ef9815a593ea15d36593f0643aaaf0149bb04be67ab851decd",
};

const submitSubscription = async (
  priceId: string,
  price: number,
  amount: number,
  isPrice: boolean,
  isTime: boolean,
  priceDifference: number,
  timeDifference: number
) => {
  const contractAddress = "0xaB17834feb6F2597923bA6081668941f740E0BF2";
  try {
    const { ethereum } = window as any;
    const provider = new ethers.BrowserProvider(ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    const options = { value: ethers.parseEther(amount.toString()) };
    let tx = await contract.registerSubscription(
      priceId,
      ethers.parseEther(price.toString()),
      isPrice,
      isTime,
      priceDifference,
      timeDifference * 1000,
      options
    );
    console.log(tx)
  } catch (err) {
    console.log(err);
  }
};

export default function Home() {
  const router = useRouter();
  const { product } = router.query;
  const [enableTime, setEnableTime] = useState(false);
  const [enablePrice, setEnablePrice] = useState(false);

  const [priceFeed, setPriceFeed] = useState(symbolToId[product as string]);
  const [price, setPrice] = useState(0);
  const [transferAmount, setTransferAmount] = useState(0);
  const [priceDifference, setPriceDifference] = useState(0);
  const [timeDifference, setTimeDifference] = useState(0);

  return (
    <Base>
      <div className="flex flex-col w-1/2">
        <div>
          <h1 className="text-xl font-bold">Subscribe to {product}</h1>
        </div>

        {/* <div className="py-4">
          <label
            htmlFor="priceFeed"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Price Feed ID
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="priceFeed"
              id="priceFeed"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="0xf9c0172ba10dfa4d19088d94f5bf61d3b54d5bd7483a322a982e1373ee8ea31b"
              value={priceFeed}
              onChange={(e) => setPriceFeed(e.target.value)}
            />
          </div>
        </div> */}

        <div className="py-4">
          <label
            htmlFor="reward"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            ETH Reward per Update
          </label>
          <div className="mt-2">
            <input
              type="number"
              name="reward"
              id="reward"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="0.01"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
            />
          </div>
        </div>

        <div className="py-4">
          <label
            htmlFor="transferAmount"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Total bounty amount
          </label>
          <div className="mt-2">
            <input
              type="number"
              name="transferAmount"
              id="transferAmount"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="0.01"
              value={transferAmount}
              onChange={(e) => setTransferAmount(parseFloat(e.target.value))}
            />
          </div>
        </div>

        <Switch
          enabled={enableTime}
          setEnabled={setEnableTime}
          text="Enable time based updates"
        />

        {enableTime && (
          <div className="py-4">
            <label
              htmlFor="time"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Time Interval (in seconds)
            </label>
            <div className="mt-2">
              <input
                type="number"
                name="time"
                id="time"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="5"
                value={timeDifference}
                onChange={(e) => setTimeDifference(parseFloat(e.target.value))}
              />
            </div>
          </div>
        )}

        <Switch
          enabled={enablePrice}
          setEnabled={setEnablePrice}
          text="Enable price based updates"
        />

        {enablePrice && (
          <div className="py-4">
            <label
              htmlFor="price"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Percentage Change in Price
            </label>
            <div className="mt-2">
              <input
                type="number"
                name="price"
                id="price"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="1"
                value={priceDifference}
                onChange={(e) => setPriceDifference(parseFloat(e.target.value))}
              />
            </div>
          </div>
        )}

        <button
          type="button"
          className="rounded-md bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100 w-full"
          onClick={async () => {
            await submitSubscription(
              symbolToId[product as string],
              price,
              transferAmount,
              enablePrice,
              enableTime,
              priceDifference,
              timeDifference
            );
          }}
        >
          Subscribe to Price Feed
        </button>
      </div>
    </Base>
  );
}
