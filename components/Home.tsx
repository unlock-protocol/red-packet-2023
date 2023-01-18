import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { useLock } from "../hooks/useLock";
import { Loading } from "./Loading";

const network = 137;
const lockAddress = "0x01703c979220de3e7662ab90a696843225d31383";

export const Home = () => {
  const { isAuthenticated, login, purchase, user } = useAuth();

  const { hasMembership, tokenId, isLoading } = useLock(
    network,
    lockAddress,
    user
  );

  const checkout = () => {
    purchase({
      title: "🧧 Happy Lunar New Year!",
      locks: {
        [lockAddress]: {
          network,
          emailRequired: true,
        },
      },
      pessimistic: true,
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  if (hasMembership) {
    return (
      <div className="flex flex-col w-full flex-col justify-center items-center	">
        <img className="w-2/3 " src="/images/red-packet/teaser.svg" />
        <h1 className="bg-red text-2xl">Mint Completed</h1>
        <p className="text-xl text-center">
          At the begining of the lunar new year, on January 22nd, you can open
          your Hongbao and see if you have received a special gift!
        </p>
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
