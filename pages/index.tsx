import CoinTable from '@/components/CoinTable'
import Chart from '@/components/Chart'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12">
      <div className="flex flex-col w-full flex-1 px-20 text-center">
        {/* <CoinTable/> */}
        <Chart
          symbol="PYTH:BTCUSD"
          interval="1"
          theme="light"
          hide_side_toolbar={true}
          allow_symbol_change={false}
          withdateranges={false}

        />        
      </div>
    </main>
  )
}
