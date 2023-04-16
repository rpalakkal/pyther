// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { headers } from "next/dist/client/components/headers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { product } = req.query;
  const liquidity = await fetch(
    `https://us.market-api.kaiko.io/v2/data/order_book_snapshots.v1/exchanges/cbse/spot/eth-usd/ob_aggregations/full?end_time=2023-04-15T00:00:00Z&start_time=2023-04-05T01:00:59Z&interval=1d`,
    {
      headers: {
        Accept: "application/json",
        "X-Api-Key": "2530bb28254d1eb99373c3c3222000e7",
      },
    }
  );
  res.status(200).json(liquidity);
}
