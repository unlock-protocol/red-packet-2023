import Head from "next/head";
import Image from "next/image";
import { ethers } from "ethers";
import { useQuery } from "@tanstack/react-query";
import Header from "../components/Header";
import { Button } from "../components/Button";

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

      <main className="px-2 md:px-8">
        <div className="p-4 md:px-32 text-white bg-left-top bg-no-repeat md:bg-[url('/images/lanterns.svg')] md:px-24">
          <Header />
          <section className="text-white w-full md:flex bg-right-top bg-no-repeat">
            <div className="md:w-2/3 md:mt-40 z-10">
              <h2 className="text-3xl	font-light leading-10">
                新年快樂, 恭喜發財
              </h2>
              <h1 className="text-6xl	sm:whitespace-nowrap	 font-semibold md:font-extrabold md:text-8xl">
                HAPPY LUNAR <br />
                NEW YEAR!
              </h1>
              <h3 className="text-2xl	font-semibold">
                Limited edition of 1680.
              </h3>
              <p>
                Lorem ipsum dolor sit amet consectetur. Mi id ut vitae aliquet
                leo interdum gravida. Sed nunc eros turpis vitae risus.
              </p>
              <Button
                disabled
                className="w-1/2 mt-8 md:w-48"
                onClick={() => {
                  console.log("mint!");
                }}
              >
                Mint (Starting January 18th!)
              </Button>
            </div>
            <div className="md:-ml-64 z-0">
              <img alt="red packer" src="/images/hero.svg" />
            </div>
          </section>

          <footer className="pt-16 text-center font-semibold text-4xl w-full pb-16 flex flex-col">
            <span className="mt-6 text-lg font-light">Unlock Labs. ♥</span>
          </footer>
        </div>
      </main>
    </>
  );
}
