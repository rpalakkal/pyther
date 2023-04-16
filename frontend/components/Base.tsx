import { useRouter } from "next/router";
export default function Home({ children }: { children: JSX.Element }) {
  const router = useRouter();
  return (
    <>
      <header className="isolate sticky top-0 z-50 p-2 border-b-2 bg-white">
        <div className="flex flex-row">
          <img
            src="https://www.gitbook.com/cdn-cgi/image/width=256,dpr=2,height=40,fit=contain,format=auto/https%3A%2F%2F828262926-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F-Me_G5lHljRT4SyKcEA9%252Flogo%252Fh0vEEm11UGmb8yrr7H18%252Flogo.png%3Falt%3Dmedia%26token%3D8e5ce850-b4cd-4670-93c9-a8ebf0077a57"
            className="max-h-7 cursor-pointer"
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
