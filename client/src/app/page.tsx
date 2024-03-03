import Link from "next/link";
import Fib from "@/components/fib";

export default function Home() {
  return (
    <main className="w-screen h-screen p-4 flex flex-col gap-6">
      <h1 className="m-auto my-0 font-bold text-3xl">Fibonacci Calculator</h1>
      <Fib />
      <Link href="/info" className="w-fit p-1 border border-solid rounded">
        Information
      </Link>
    </main>
  );
}
