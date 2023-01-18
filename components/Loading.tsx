import Image from "next/image";

export const Loading = () => {
  return (
    <div className="flex flex-col w-full flex-col justify-center items-center h-96		">
      <Image width="100" height="100" alt="loading" src="/images/loader.svg" />
    </div>
  );
};
