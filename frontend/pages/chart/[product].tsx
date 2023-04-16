import Chart from "@/components/Chart";
import Base from "@/components/Base";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const { product } = router.query;

  return (
    <Base>
      <Chart
        symbol={`PYTH:${product}`}
        interval="1"
        theme="light"
        hide_side_toolbar={true}
        allow_symbol_change={false}
        withdateranges={false}
      />
    </Base>
  );
}
