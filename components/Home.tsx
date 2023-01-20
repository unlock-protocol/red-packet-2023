import { useRouter } from "next/router";
import { Button, buttonClasses } from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { useLock } from "../hooks/useLock";
import { Loading } from "./Loading";
import { BsTwitter } from "react-icons/bs";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useMetadata } from "../hooks/useMetadata";
import { IpfsImage } from "./IpfsImage";
import { useQuery } from "@tanstack/react-query";

const network = 137;
const lockAddress = "0x01703c979220de3e7662ab90a696843225d31383";

export const Home = () => {
  const [loadingClaim, setLoadingClaim] = useState(false);
  const [claimTx, setClaimTx] = useState(undefined);
  const [hasSent, setHasSent] = useState(false);
  const { isAuthenticated, login, purchase, user } = useAuth();
  const router = useRouter();

  const { hasMembership, tokenId, isLoading } = useLock(
    network,
    lockAddress,
    user
  );

  const { data: metadata, isLoading: isMedatataLoading } = useMetadata(
    network,
    lockAddress,
    tokenId
  );

  // Cleanup URL!
  useEffect(() => {
    if (router.query?.done === "true") {
      // We just need to remove the code!
      const url = new URL(window.location.toString());
      url.searchParams.delete("done");
      router.replace(url.toString(), undefined, {
        shallow: true,
      });
      setHasSent(true);
    }
  }, [router]);

  const checkout = () => {
    purchase(
      {
        title: "🧧 Happy Lunar New Year!",
        locks: {
          [lockAddress]: {
            network,
            emailRequired: true,
            maxRecipients: 10,
          },
        },
        pessimistic: true,
      },
      {
        done: "true",
      }
    );
  };

  // Send an API call to claim prize!
  const claim = async (tokenId: number) => {
    setLoadingClaim(true);
    try {
      const res = await fetch(`/api/claim`, {
        method: "POST",
        body: JSON.stringify({ tokenId }), // body data type must match "Content-Type" header
      });
      const { hash } = await res.json();
      setClaimTx(hash);
    } catch (err) {
      console.log(err);
    }
    setLoadingClaim(false);
  };

  const tweetIntent = new URL("https://twitter.com/intent/tweet");
  tweetIntent.searchParams.set(
    "text",
    `🧧 I have just gifted a Red Packet #hongbao to a friend of mine with @unlockProtocol. You should do it too! `
  );
  tweetIntent.searchParams.set("url", "https://red-packet.unlock-protocol.com");

  if (isLoading || isMedatataLoading) {
    return <Loading />;
  }

  if (hasSent) {
    return (
      <div className="flex flex-col w-full flex-col justify-center items-center	">
        <Image
          alt="red packet teaser"
          width="500"
          height="500"
          src="/images/red-packet/teaser.svg"
        />
        <h1 className="bg-red text-2xl">Mint Completed</h1>
        <p className="text-xl text-center w-1/2">
          At the beginning of the lunar new year, on January 22nd, your friend
          can open your Hongbao and see if they have received a special gift!
          <br />
          Please ask them to connect their wallet on:
          <pre>
            <Link href="https://red-packet.unlock-protocol.com/">
              https://red-packet.unlock-protocol.com/
            </Link>
          </pre>
        </p>
        <div className="flex mt-8">
          <Link
            className={`${buttonClasses} hover:bg-red bg-darkred  mr-3`}
            href={tweetIntent.toString()}
          >
            <BsTwitter className="inline-block mr-2" />
            Tweet this!
          </Link>
          <Button className="" onClick={() => checkout()}>
            Send another red packet!
          </Button>
        </div>
      </div>
    );
  }

  const prize = metadata?.attributes?.find((x: any) => x.trait_type === "Prize")
    ?.value;
  const redeemed = metadata?.attributes?.find(
    (x: any) => x.trait_type === "Redeemed"
  )?.value;

  if (hasMembership) {
    return (
      <div className="flex flex-col w-full flex-col justify-center items-center	">
        <IpfsImage
          alt="red packet"
          width="500"
          height="500"
          src={metadata.image}
        />
        <h1 className="bg-red text-2xl mb-4 underline">
          <Link
            href={`https://opensea.io/assets/matic/${lockAddress}/${tokenId}`}
          >
            {metadata.name}
          </Link>
        </h1>

        {metadata.attributes.length === 0 && (
          <>
            <p className="text-xl text-center w-1/2">
              At the beginning of the lunar new year, on January 22nd, you can
              open your Hongbao and see if you have received a special gift!
            </p>
            <div className="flex mt-8">
              <Link
                className={`${buttonClasses} hover:bg-red bg-darkred  mr-3`}
                href={tweetIntent.toString()}
              >
                <BsTwitter className="inline-block mr-2" />
                Tweet this!
              </Link>
              <Button className="" onClick={() => checkout()}>
                Send another red packet!
              </Button>
            </div>
          </>
        )}
        {metadata.attributes.length > 0 && (
          <>
            {parseInt(prize) === 0 && (
              <p className="text-xl text-center w-1/2">
                We wish you a Happy New Year!
                <br />
                This time, there was no
              </p>
            )}
            {parseInt(prize) > 0 && !redeemed && (
              <>
                <p className="text-xl text-center w-1/2">
                  Congratulations! There is {prize} Matic in your red envelope!{" "}
                </p>
                {!claimTx && (
                  <div className="mt-8">
                    <Button
                      disabled={loadingClaim || claimTx}
                      className="w-48 flex-row"
                      onClick={() => claim(tokenId.toNumber())}
                    >
                      Claim
                      {loadingClaim && (
                        <Image
                          className="ml-1 inline"
                          width="16"
                          height="16"
                          alt="loading"
                          src="/images/loader.svg"
                        />
                      )}
                    </Button>
                  </div>
                )}
                {claimTx && (
                  <p className="mt-8">
                    <Link
                      className="underline"
                      target="_blank"
                      href={`https://polygonscan.com/tx/${claimTx}`}
                    >
                      The transaction was sent
                    </Link>{" "}
                    and you will receive the Matic in your wallet shortly!
                  </p>
                )}
              </>
            )}
            {parseInt(prize) > 0 && redeemed && (
              <>
                <p className="text-xl text-center w-1/2">
                  Congratulations! There was {prize} Matic in your red envelope!{" "}
                  It was sent to your wallet!
                </p>
              </>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="md:w-2/3 md:mt-40 z-10">
        <h2 className="text-3xl	font-light leading-10">新年快樂, 恭喜發財</h2>
        <h1 className="text-6xl	sm:whitespace-nowrap font-semibold md:font-extrabold md:text-8xl">
          HAPPY LUNAR <br />
          NEW YEAR!
        </h1>
        <h3 className="text-2xl	font-semibold">Limited edition of 1680.</h3>
        <p>
          Gift a red packet to your friends and loved ones! On the day of the
          lunar new year, they may get a prize!
        </p>
        <p>
          {isAuthenticated && (
            <Button
              className="w-1/2 mt-8 md:w-48 bg-gradient-to-r from-blue-500"
              onClick={() => checkout()}
            >
              Send a red packet!
            </Button>
          )}
          {!isAuthenticated && (
            <Button
              className="w-full mt-8 md:w-96 bg-gradient-to-r from-blue-500"
              onClick={() => login()}
            >
              Connect your wallet to get started
            </Button>
          )}
        </p>
      </div>
      <div className="md:-ml-64 z-0">
        <img alt="red packer" src="/images/hero.svg" />
      </div>
    </>
  );
};
