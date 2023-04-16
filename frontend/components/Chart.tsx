import dynamic from "next/dynamic";
const ChartNoSSR = dynamic(
  () => import("react-ts-tradingview-widgets").then((w) => w.AdvancedRealTimeChart),
  {
    ssr: false,
  }
);

export default ChartNoSSR;