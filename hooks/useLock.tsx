import { useRouter } from "next/router";
import { useEffect, useMemo, useCallback, useState } from "react";
import { ethers } from "ethers";
import { useQuery } from "@tanstack/react-query";
import PublicLockV12 from "@unlock-protocol/contracts/dist/abis/PublicLock/PublicLockV12.json";

export function useLock(network: number, lockAddress: string, address: string) {
  const query = useQuery(["key", network, lockAddress, address], async () => {
    if (!network || !lockAddress || !address) {
      return false;
    }

    const provider = new ethers.providers.JsonRpcProvider(
      `https://rpc.unlock-protocol.com/${network}`
    );

    const lock = new ethers.Contract(lockAddress, PublicLockV12.abi, provider);
    const hasMembership = await lock.getHasValidKey(address);
    let tokenId = undefined;
    if (hasMembership) {
      tokenId = await lock.tokenOfOwnerByIndex(address, 0);
    }
    return {
      hasMembership,
      tokenId,
    };
  });

  return {
    ...query.data,
    isLoading: query.isLoading,
  };
}
