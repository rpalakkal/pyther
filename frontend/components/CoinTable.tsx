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
  redir: string;
}

interface IPrice {
  price: number;
  confidence: number;
  priceString: string;
  confidenceString: string;
  hourChange: number;
  weekChange: number;
  dayChange: number;
  priceHourAgo: number;
}

async function getHistoricalPrice(
  timestamp: number,
  base: string,
  quote: string
): Promise<any> {
  const response = await fetch(
    `https://pyth-api.vintage-orange-muffin.com/tradingview/history?from=${timestamp}&to=${timestamp}&resolution=1&symbol=${base}/${quote}`
  );
  const body = await response.json();
  return body["c"][0];
}

const CoinTable = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [prices, setPrices] = useState<{ [symbol: string]: IPrice }>({});
  const router = useRouter();
  const pythClient = new PythHttpClient(connection, pythPublicKey);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await pythClient.getData();
      let tempPrices: { [symbol: string]: IPrice } = {};
      const tempProducts = data.symbols
        .filter(
          (symbol) =>
            data.productFromSymbol.get(symbol)!.asset_type === "Crypto" &&
            data.productPrice.get(symbol)!.price &&
            ["Crypto.BTC/USD", "Crypto.ETH/USD", "Crypto.SOL/USD"].includes(
              symbol
            )
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
            hourChange: 0,
            dayChange: 0,
            weekChange: 0,
            priceHourAgo: 0,
          };

          tempPrices = { ...tempPrices, [symbol]: priceInfo };
          return {
            id: symbol,
            name: `${product.base}/${product.quote_currency}`,
            redir: `chart/${product.base}${product.quote_currency}`,
            code: product.base,
            price: priceString,
            confidence: confidenceString,
          };
        })
        .sort((a, b) => a.id.localeCompare(b.id));
      setPrices(tempPrices);
      setProducts(tempProducts);
    };
    fetchProducts();
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

  useEffect(() => {
    const interval = setInterval(async () => {
      const data = await pythClient.getData();
      let tempPrices = { ...prices };
      for (const product of products) {
        const price = data.productPrice.get(product.id)!;
        const formattedPrice = price.price
          ? formatCurrency(price.price, "USD", "en")
          : "";
        const priceString = price.price ? formattedPrice : "";
        const confidenceString = price.confidence
          ? `±${formatCurrency(price.confidence, "USD", "en")}`
          : "";
        if (
          price.price &&
          price.confidence &&
          data.productFromSymbol.get(product.id)!.asset_type === "Crypto"
        ) {
          const changeInPrice =
            (price.price - tempPrices[product.id].priceHourAgo) / price.price;

          let priceHourAgoString = tempPrices[product.id].hourChange;
          let priceDayAgoString = tempPrices[product.id].dayChange;
          let priceWeekAgoString = tempPrices[product.id].weekChange;
          let priceHourAgo = tempPrices[product.id].priceHourAgo;

          console.log(
            Math.abs(
              Math.abs(changeInPrice) - tempPrices[product.id].hourChange
            )
          );
          if (
            Math.abs(
              Math.abs(changeInPrice) - tempPrices[product.id].hourChange
            ) > 0.1
          ) {
            const today = new Date();
            const yesterday = Math.floor(
              (today.getTime() - 1000 * 60 * 60 * 24) / 1000
            );
            const hourago = Math.floor(
              (today.getTime() - 1000 * 60 * 60) / 1000
            );
            const weekago = Math.floor(
              (today.getTime() - 1000 * 60 * 60 * 24 * 7) / 1000
            );
            const base = data.productFromSymbol.get(product.id)!.base;
            const quote = data.productFromSymbol.get(
              product.id
            )!.quote_currency;
            priceHourAgo = await getHistoricalPrice(hourago, base, quote);
            const priceDayAgo = await getHistoricalPrice(
              yesterday,
              base,
              quote
            );
            const priceWeekAgo = await getHistoricalPrice(weekago, base, quote);
            priceHourAgoString =
              (100 * (price.price - priceHourAgo)) / price.price;
            priceDayAgoString =
              (100 * (price.price - priceDayAgo)) / price.price;
            priceWeekAgoString =
              (100 * (price.price - priceWeekAgo)) / price.price;
          }
          const priceInfo = {
            price: price.price ? price.price : 0,
            confidence: price.confidence ? price.confidence : 0,
            priceString,
            confidenceString,
            hourChange: priceHourAgoString,
            dayChange: priceDayAgoString,
            weekChange: priceWeekAgoString,
            priceHourAgo,
          };
          tempPrices[product.id] = priceInfo;
        }
      }
      setPrices(tempPrices);
    }, 5000);
    return () => clearInterval(interval);
  }, [products]);

  useEffect(() => {}, [products]);

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
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {products.map((product) => (
                  <tr
                    className="hover:bg-slate-50 cursor-pointer"
                    key={product.id}
                    onClick={() => router.push(product.redir)}
                  >
                    <td className="whitespace-nowrap px-2 py-2 text-left text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-left text-sm text-gray-900">
                      {prices[product.id].priceString}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-left text-sm text-gray-900">
                      {prices[product.id].confidenceString}
                    </td>
                    <td
                      className={`whitespace-nowrap px-2 py-2 text-left text-sm ${
                        prices[product.id].hourChange > 0
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {`${prices[product.id].hourChange.toFixed(3)} %`}
                    </td>
                    <td
                      className={`whitespace-nowrap px-2 py-2 text-left text-sm ${
                        prices[product.id].dayChange > 0
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {`${prices[product.id].dayChange.toFixed(3)} %`}
                    </td>
                    <td
                      className={`whitespace-nowrap px-2 py-2 text-left text-sm ${
                        prices[product.id].weekChange > 0
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {`${prices[product.id].weekChange.toFixed(3)} %`}
                    </td>
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
