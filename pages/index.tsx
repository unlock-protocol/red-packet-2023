import Head from "next/head";
import Image from "next/image";
import { ethers } from "ethers";
import { useQuery } from "@tanstack/react-query";
import Header from "../components/Header";

export default function Home() {
  return (
    <>
      <Head>
        <title>TK</title>
        <meta property="og:title" content="TK" key="title" />
        <meta property="og:description" key="description" content="" />
        <meta property="og:image" content="TK" />
        <meta
          property="og:url"
          content="https://red-packet.unlock-protocol.com/"
        />
        <meta property="og:type" content="website" />
      </Head>

      <main className="">
        <div className="container">
          <Header />
          <section>TK</section>
          <footer className="pt-16 text-center font-semibold text-4xl w-full pb-16 flex flex-col">
            <span className="mt-6 text-lg font-light">Unlock Labs. ♥</span>
          </footer>
        </div>
      </main>
    </>
  );
}
