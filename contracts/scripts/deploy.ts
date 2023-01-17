const { network, unlock, ethers, getChainId } = require("hardhat");
import deploy from "../lib/deploy";

/**
 * main!
 * @returns
 */
async function main() {
  const [user] = await ethers.getSigners();
  const { chainId } = await ethers.provider.getNetwork();
  console.log(`Deploying from ${user.address} on ${chainId}`);

  const RedPacket = await ethers.getContractFactory("RedPacket");
  const reveal = 1674324000000; // Sat Jan 21 2023 19:36:00 GMT-0500 (Eastern Standard Time)
  const hook = await RedPacket.deploy(
    "0x611dcb02f50505305ae59a4b6b9802dd00cf0088", // Goerli lock
    reveal
  );
  await hook.deployed();

  console.log(
    `Make the hook onKeyPurchaseHook and onTokenURIHook ${hook.address}`
  );
  // await (
  //   await lock.setEventHooks(
  //     hook.address, // _onKeyPurchaseHook
  //     ethers.constants.AddressZero, // _onKeyCancelHook
  //     ethers.constants.AddressZero, // _onValidKeyHook
  //     hook.address, // _onTokenURIHook
  //     ethers.constants.AddressZero, // _onKeyTransferHook
  //     ethers.constants.AddressZero, // _onKeyExtendHook
  //     ethers.constants.AddressZero // _onKeyGrantHook
  //   )
  // ).wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
