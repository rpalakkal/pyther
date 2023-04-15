import { useEffect, useState } from "react";
import { Connection } from "@solana/web3.js";
import { useRouter } from "next/router";
import {
  PriceStatus,
  PythHttpClient,
  getPythClusterApiUrl,
  getPythProgramKeyForCluster,
  PythCluster,
  PythConnection,
} from "@pythnetwork/client";
import { formatCurrency } from "@coingecko/cryptoformat";

const PYTHNET_CLUSTER_NAME: PythCluster = "pythnet";
const connection = new Connection(getPythClusterApiUrl(PYTHNET_CLUSTER_NAME));
const pythPublicKey = getPythProgramKeyForCluster(PYTHNET_CLUSTER_NAME);

interface IProduct {
  id: string;
  name: string;
  code: string;
  hour: string;
  day: string;
  week: string;
  redir: string;
  // marketCap: string;
  // volume: string;
  // circulatingSupply: string;
}

interface IPrice {
  price: number;
  confidence: number;
  priceString: string;
  confidenceString: string;
}

const CoinTable = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [prices, setPrices] = useState<{ [symbol: string]: IPrice }>({});
  const router = useRouter();

  useEffect(() => {
    const pythClient = new PythHttpClient(connection, pythPublicKey);
    const fetchProducts = async () => {
      const data = await pythClient.getData();
      let tempPrices: { [symbol: string]: IPrice } = {};
      const tempProducts = data.symbols
        .filter(
          (symbol) =>
            data.productFromSymbol.get(symbol)!.asset_type === "Crypto" &&
            data.productPrice.get(symbol)!.price
        )
        .map((symbol) => {
          const price = data.productPrice.get(symbol)!;
          const formattedPrice = price.price
            ? formatCurrency(price.price, "USD", "en")
            : "";
          const priceString = price.price ? formattedPrice : "";
          const confidenceString = price.confidence
            ? `±${formatCurrency(price.confidence, "USD", "en")}`
            : "";
          const product = data.productFromSymbol.get(symbol)!;
          const priceInfo = {
            price: price.price ? price.price : 0,
            confidence: price.confidence ? price.confidence : 0,
            priceString,
            confidenceString,
          };
          tempPrices = { ...tempPrices, [symbol]: priceInfo };
          return {
            id: symbol,
            name: `${product.base}/${product.quote_currency}`,
            redir: `${product.base}${product.quote_currency}`,
            code: product.base,
            price: priceString,
            confidence: confidenceString,
            hour: "12.00",
            day: "$4,397.00",
            week: "$4,397.00",
            // marketCap: "$4,397.00",
            // volume: "$4,397.00",
            // circulatingSupply: "$4,397.00",
          };
        });
      setPrices(tempPrices);
      setProducts(tempProducts);
    };
    fetchProducts();
    const interval = setInterval(async () => {
      const data = await pythClient.getData();
      let tempPrices: { [symbol: string]: IPrice } = {};
      for (const product of products) {
        const price = data.productPrice.get(product.id)!;
        const formattedPrice = price.price
          ? formatCurrency(price.price, "USD", "en")
          : "";
        const priceString = price.price ? formattedPrice : "";
        const confidenceString = price.confidence
          ? `±${formatCurrency(price.confidence, "USD", "en")}`
          : "";
        const priceInfo = {
          price: price.price ? price.price : 0,
          confidence: price.confidence ? price.confidence : 0,
          priceString,
          confidenceString,
        };
        tempPrices = { ...tempPrices, [product.id]: priceInfo };
      }
      setPrices(tempPrices);
    }, 5000);
    // const pythConnection = new PythConnection(connection, pythPublicKey);
    // pythConnection.onPriceChangeVerbose((productAccount, priceAccount) => {
    //   const product = productAccount.accountInfo.data.product;
    //   const price = priceAccount.accountInfo.data;
    //   if (price.price && price.confidence && product.asset_type === "Crypto") {
    //     const priceString = formatCurrency(price.price, "USD", "en");
    //     const confidenceString = `±${formatCurrency(
    //       price.confidence,
    //       "USD",
    //       "en"
    //     )}`;
    //     const priceInfo = {
    //       price: price.price ? price.price : 0,
    //       confidence: price.confidence ? price.confidence : 0,
    //       priceString,
    //       confidenceString,
    //     };
    //     const tempPrices = { ...prices, [product.symbol]: priceInfo };
    //     setPrices(tempPrices);
    //   } else {
    //     // tslint:disable-next-line:no-console
    //     // console.log(`${product.symbol}: price currently unavailable. status is ${PriceStatus[price.status]}`)
    //   }
    // });
    // pythConnection.start();
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mt-4 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  {/* <th
                    scope="col"
                    className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    #
                  </th> */}
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Confidence
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    1h %
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    24h %
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    7d %
                  </th>
                  {/* <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Market Cap
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Volume
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Circulating Supply
                  </th> */}
                  {/* <th
                    scope="col"
                    className="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-0"
                  >
                    <span className="sr-only">Edit</span>
                  </th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {products.map((product) => (
                  <tr
                    className="hover:bg-slate-50 cursor-pointer"
                    key={product.id}
                    onClick={() => router.push(product.redir)}
                  >
                    {/* <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                      {product.id}
                    </td> */}
                    <td className="whitespace-nowrap px-2 py-2 text-left text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-left text-sm text-gray-900">
                      {prices[product.id].priceString}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-left text-sm text-gray-900">
                      {prices[product.id].confidenceString}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-left text-sm text-gray-500">
                      {product.hour}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-left text-sm text-gray-500">
                      {product.day}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-left text-sm text-gray-500">
                      {product.week}
                    </td>
                    {/* <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      {product.marketCap}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      {product.volume}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      {product.circulatingSupply}
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinTable;
