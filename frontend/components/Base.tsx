import { useRouter } from "next/router";
export default function Home({ children }: { children: JSX.Element }) {
  const router = useRouter();
  return (
    <>
      <header className="isolate sticky top-0 z-50 p-2 border-b-2 bg-white">
        <div className="flex flex-row">
          <img
            src="/logo.png"
            className="max-h-12 cursor-pointer"
            onClick={() => router.push("/")}
          />
        </div>
      </header>
      <main className="flex min-h-screen flex-col items-center justify-between p-6">
        <div className="flex flex-col w-full flex-1 px-20">
          {children}
        </div>
      </main>
    </>
  );
}
