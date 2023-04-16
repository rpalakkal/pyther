import Chart from "@/components/Chart";
import Base from "@/components/Base";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const { product } = router.query;

  return (
    <Base>
    <>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {product}
        </h1>
        <button onClick={()=>router.push(`../subscribe/${product}`)}>
          Subscribe to Price Feed
        </button>
      </div>
      <Chart
        symbol={`PYTH:${product}`}
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
