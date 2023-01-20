import { useRouter } from "next/router";
import { useEffect, useMemo, useCallback, useState } from "react";
import { ethers } from "ethers";
import { useQuery } from "@tanstack/react-query";
import PublicLockV12 from "@unlock-protocol/contracts/dist/abis/PublicLock/PublicLockV12.json";

const parseJsonDataUri = (uri: string): any => {
  const regex = /^data:.+\/(.+);base64,(.*)$/;

  const matches = uri.match(regex);
  if (!matches) {
    throw new Error("not valid");
  }
  const ext = matches[1];
  if (ext !== "json") {
    throw new Error("not json");
  }
  const data = matches[2];
  const buffer = Buffer.from(data, "base64");
  const asString = buffer.toString();
  return JSON.parse(asString);
};

export function useMetadata(
  network: number,
  lockAddress: string,
  tokenId: string
) {
  return useQuery(["metadata", network, lockAddress, tokenId], async () => {
    if (!network || !lockAddress || !tokenId) {
      return {};
    }
    const provider = new ethers.providers.JsonRpcProvider(
      `https://rpc.unlock-protocol.com/${network}`
    );

    const lock = new ethers.Contract(lockAddress, PublicLockV12.abi, provider);
    const metadata = parseJsonDataUri(await lock.tokenURI(tokenId));
    return {
      description: "A Red Packet for the Lunar New Year of 2023!",
      external_url: "https://red-packet.unlock-protocol.com/",
      image: "ipfs://QmZ36mis8daTmXWeBcTjfHCSSeQMyWcJH8mNvyB6i8KAXb/168.svg",
      name: "Red Packet #1",
      attributes: [
        { trait_type: "Prize", value: 168 },
        { trait_type: "Redeemed", value: false },
      ],
    };
    return metadata;
  });
}
