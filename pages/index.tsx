import Head from "next/head";
import Image from "next/image";
import { ethers } from "ethers";
import { useQuery } from "@tanstack/react-query";
import Header from "../components/Header";
import { Home } from "../components/Home";

export default function Index() {
  return (
    <>
      <Head>
        <title>Red Packet 2023</title>

        <meta property="og:title" content="Red Packet" key="title" />
        <meta property="og:description" key="description" content="" />
        <meta
          property="og:image"
          content="https://unlock-protocol.com/images/blog/redpacket-rabbit/redpacket-rabbit.png"
        />
        <meta
          property="og:url"
          content="https://red-packet.unlock-protocol.com/"
        />
        <meta property="og:type" content="website" />
      </Head>

      <main className="px-2 md:px-8">
        <div className="p-4 md:px-32 text-white bg-left-top bg-no-repeat md:bg-[url('/images/lanterns.svg')] md:px-24">
          <Header />
          <section className="text-white w-full md:flex bg-right-top bg-no-repeat">
            <Home />
          </section>

          <footer className="pt-16 text-center font-semibold text-4xl w-full pb-16 flex flex-col">
            <span className="mt-6 text-lg font-light">Unlock Labs. ♥</span>
          </footer>
        </div>
      </main>
    </>
  );
}
