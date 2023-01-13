import { useRouter } from "next/router";
import { useEffect, useMemo, useCallback, useState } from "react";
import { ethers } from "ethers";
import { useQuery } from "@tanstack/react-query";

export function useLock(address: string, lockAddress: string) {
  const query = useQuery(["key", lockAddress, address], async () => {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://rpc.unlock-protocol.com/137"
    );

    const lock = new ethers.Contract(
      lockAddress,
      [
        {
          inputs: [
            { internalType: "address", name: "_keyOwner", type: "address" },
          ],
          name: "getHasValidKey",
          outputs: [{ internalType: "bool", name: "isValid", type: "bool" }],
          stateMutability: "view",
          type: "function",
        },
      ],
      provider
    );
    return await lock.getHasValidKey(address);
  });

  return {
    hasMembership: query.data,
    isLoading: query.isLoading,
  };
}
