import { useEffect, useState } from "react";
import { Connection } from "@solana/web3.js";
import {
  PriceStatus,
  PythHttpClient,
  getPythClusterApiUrl,
  getPythProgramKeyForCluster,
  PythCluster,
} from "@pythnetwork/client";
import { formatCurrency } from "@coingecko/cryptoformat";

const PYTHNET_CLUSTER_NAME: PythCluster = "pythnet";
const connection = new Connection(getPythClusterApiUrl(PYTHNET_CLUSTER_NAME));
const pythPublicKey = getPythProgramKeyForCluster(PYTHNET_CLUSTER_NAME);

interface IProduct {
  id: string;
  name: string;
  code: string;
  price: string;
  confidence: string;
  hour: string;
  day: string;
  week: string;
  // marketCap: string;
  // volume: string;
  // circulatingSupply: string;
}

// import { Connection } from '@solana/web3.js'
// import { getPythClusterApiUrl, getPythProgramKeyForCluster, PythCluster, PriceStatus, PythConnection } from '@pythnetwork/client'

// const PYTHNET_CLUSTER_NAME: PythCluster = 'pythnet'
// const connection = new Connection(getPythClusterApiUrl(PYTHNET_CLUSTER_NAME))
// const pythPublicKey = getPythProgramKeyForCluster(PYTHNET_CLUSTER_NAME)

// const pythConnection = new PythConnection(connection, pythPublicKey)
// pythConnection.onPriceChangeVerbose((productAccount, priceAccount) => {
//   // The arguments to the callback include solana account information / the update slot if you need it.
//   const product = productAccount.accountInfo.data.product
//   const price = priceAccount.accountInfo.data
//   // sample output:
//   // SOL/USD: $14.627930000000001 ±$0.01551797
//   if (price.price && price.confidence) {
//     // tslint:disable-next-line:no-console
//     console.log(`${product.symbol}: $${price.price} \xB1$${price.confidence}`)
//   } else {
//     // tslint:disable-next-line:no-console
//     console.log(`${product.symbol}: price currently unavailable. status is ${PriceStatus[price.status]}`)
//   }
// })

// tslint:disable-next-line:no-console
// console.log('Reading from Pyth price feed...')
// pythConnection.start()

const CoinTable = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  useEffect(() => {
    const fetchProducts = async () => {
      const pythClient = new PythHttpClient(connection, pythPublicKey);
      const data = await pythClient.getData();
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
          const priceString = price.price ? `$${price.price}` : "";
          const confidenceString = price.confidence
            ? `±$${formatCurrency(price.confidence, "USD", "en")}`
            : "";
          const product = data.productFromSymbol.get(symbol)!;
          return {
            id: symbol,
            name: `${product.base}/${product.quote_currency}`,
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
      setProducts(tempProducts);
    };
    fetchProducts();
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mt-8 flow-root">
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
                  <tr key={product.id}>
                    {/* <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                      {product.id}
                    </td> */}
                    <td className="whitespace-nowrap px-2 py-2 text-left text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-left text-sm text-gray-900">
                      {product.price}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-left text-sm text-gray-900">
                      {product.confidence}
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
