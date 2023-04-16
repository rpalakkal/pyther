import Chart from "@/components/Chart";
import Base from "@/components/Base";
import { useRouter } from "next/router";
import {
  PriceStatus,
  PythHttpClient,
  getPythClusterApiUrl,
  getPythProgramKeyForCluster,
  PythCluster,
  PythConnection,
} from "@pythnetwork/client";
import { Connection, PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";

const PYTHNET_CLUSTER_NAME: PythCluster = "pythnet";
const connection = new Connection(getPythClusterApiUrl(PYTHNET_CLUSTER_NAME));
const pythPublicKey = getPythProgramKeyForCluster(PYTHNET_CLUSTER_NAME);


const symbolToId: { [symbol: string]: string } = {
  BTCUSD: "GVXRSBjFk6e6J3NbVPXohDJetcTjaeeuykUpbQF8UoMU",
  ETHUSD: "JBu1AL4obBcCMqKBBxhpWCNUt136ijcuMZLFvTP7iWdB6",
  SOLUSD: "H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG",
};



export default function Home() {
  const router = useRouter();
  const { product } = router.query;
  const feeds = [new PublicKey(symbolToId[product as string])]
  const [price, setPrice] = useState(0);
  const [confidence, setConfidence] = useState(0);

  // useEffect(() => {
  //   const pythConnection = new PythConnection(connection, pythPublicKey, 'confirmed', feeds);
  //   pythConnection.onPriceChangeVerbose((productAccount, priceAccount) => {
  //     const product = productAccount.accountInfo.data.product
  //     const price = priceAccount.accountInfo.data
  //     // sample output:
  //     // SOL/USD: $14.627930000000001 ±$0.01551797
  //     if (price.price && price.confidence) {
  //       setPrice(price.price)
  //       setConfidence(price.confidence)
  //     } else {
  //       // tslint:disable-next-line:no-console
  //       console.log(`${product.symbol}: price currently unavailable. status is ${PriceStatus[price.status]}`)
  //     }
  //   })
  //   pythConnection.start()
  // },[]);

  return (
    <Base>
    <>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {product}
        </h1>
        {/* <h2 className="text-xl font-bold text-gray-900">
          {price}
        </h2> */}
        <button onClick={()=>router.push(`../subscribe/${product}`)}>
          Subscribe to Price Feed
        </button>
      </div>
      <Chart
        symbol={`PYTH:${router.query.product}`}
        interval="1"
        theme="light"
        hide_side_toolbar={true}
        allow_symbol_change={false}
        withdateranges={false}
      />
      </>
    </Base>
  );
}
