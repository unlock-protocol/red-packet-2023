const { expect } = require("chai");
const { ethers, unlock } = require("hardhat");
import { time } from "@nomicfoundation/hardhat-network-helpers";

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

describe("RedPacket", function () {
  it("should work as a hook", async function () {
    const [user] = await ethers.getSigners();
    await unlock.deployProtocol();
    const expirationDuration = 60 * 60 * 24 * 7;
    const maxNumberOfKeys = 1680;
    const keyPrice = ethers.utils.parseEther("1.0");
    const reveal = Math.floor(await time.latest()) + 60 * 60 * 24; // tomorrow!
    const recipient = "0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5"; // Random address as recipient!

    const { lock } = await unlock.createLock({
      expirationDuration,
      maxNumberOfKeys,
      keyPrice,
      name: "red packer",
    });
    const RedPacket = await ethers.getContractFactory("RedPacket");
    const hook = await RedPacket.deploy(lock.address, reveal);
    await hook.deployed();

    await (
      await lock.setEventHooks(
        hook.address, // _onKeyPurchaseHook
        ethers.constants.AddressZero, // _onKeyCancelHook
        ethers.constants.AddressZero, // _onValidKeyHook
        hook.address, // _onTokenURIHook
        ethers.constants.AddressZero, // _onKeyTransferHook
        ethers.constants.AddressZero, // _onKeyExtendHook
        ethers.constants.AddressZero // _onKeyGrantHook
      )
    ).wait();

    // Make the Hook a lock manager so it can withdraw funds!
    await (await lock.addLockManager(hook.address)).wait();

    // And now let's do a full purchase which should *just work*
    await expect(
      lock.purchase([keyPrice], [recipient], [recipient], [recipient], [0x0], {
        value: keyPrice,
      })
    ).not.to.reverted;

    expect(await hook.prize(1)).to.equal(0); // No prize yet!
    const metadata = parseJsonDataUri(await lock.tokenURI(1));
    expect(metadata.description).to.equal(
      "A Red Packet for the Lunar New Year of 2023!"
    );
    expect(metadata.external_url).to.equal(
      "https://red-packet.unlock-protocol.com/"
    );
    expect(metadata.image).to.equal(
      "ipfs://QmZ36mis8daTmXWeBcTjfHCSSeQMyWcJH8mNvyB6i8KAXb/teaser.svg"
    );
    expect(metadata.name).to.equal("Red Packet #1");
    expect(metadata.attributes.length).to.equal(0);

    await time.increaseTo(reveal + 1);

    // Try to purchase now fails!
    await expect(
      lock.purchase([keyPrice], [recipient], [recipient], [recipient], [0x0], {
        value: keyPrice,
      })
    ).to.reverted;

    expect(await hook.prize(1)).to.equal(168); // Always winning since it's the only player!
    const metadataAfterReveal = parseJsonDataUri(await lock.tokenURI(1));
    expect(metadataAfterReveal.description).to.equal(
      "A Red Packet for the Lunar New Year of 2023!"
    );
    expect(metadataAfterReveal.external_url).to.equal(
      "https://red-packet.unlock-protocol.com/"
    );
    expect(metadataAfterReveal.image).to.equal(
      "ipfs://QmZ36mis8daTmXWeBcTjfHCSSeQMyWcJH8mNvyB6i8KAXb/168.svg"
    );
    expect(metadataAfterReveal.name).to.equal("Red Packet #1");
    expect(metadataAfterReveal.attributes.length).to.equal(2);
    expect(metadataAfterReveal.attributes[0].trait_type).to.equal("Prize");
    expect(metadataAfterReveal.attributes[0].value).to.equal(168);
    expect(metadataAfterReveal.attributes[1].trait_type).to.equal("Redeemed");
    expect(metadataAfterReveal.attributes[1].value).to.equal(false);

    const owner = await lock.ownerOf("1");
    const balanceBefore = await ethers.provider.getBalance(owner);
    expect(await ethers.provider.getBalance(lock.address)).to.equal(keyPrice);
    await hook.claimPrize(1);
    const balanceAfter = await ethers.provider.getBalance(owner);
    expect(await ethers.provider.getBalance(lock.address)).to.equal(0);
    expect(balanceAfter).to.above(balanceBefore);

    // Redeem again!
    await expect(hook.claimPrize(1)).to.reverted;

    const metadataAfterClaimPrize = parseJsonDataUri(await lock.tokenURI(1));
    expect(metadataAfterClaimPrize.description).to.equal(
      "A Red Packet for the Lunar New Year of 2023!"
    );
    expect(metadataAfterClaimPrize.external_url).to.equal(
      "https://red-packet.unlock-protocol.com/"
    );
    expect(metadataAfterClaimPrize.image).to.equal(
      "ipfs://QmZ36mis8daTmXWeBcTjfHCSSeQMyWcJH8mNvyB6i8KAXb/168.svg"
    );
    expect(metadataAfterClaimPrize.name).to.equal("Red Packet #1");
    expect(metadataAfterClaimPrize.attributes.length).to.equal(2);
    expect(metadataAfterClaimPrize.attributes[0].trait_type).to.equal("Prize");
    expect(metadataAfterClaimPrize.attributes[0].value).to.equal(168);
    expect(metadataAfterClaimPrize.attributes[1].trait_type).to.equal(
      "Redeemed"
    );
    expect(metadataAfterClaimPrize.attributes[1].value).to.equal(true);
  });

  it.only("should work when there are many buyers!", async function () {
    const [user] = await ethers.getSigners();
    await unlock.deployProtocol();
    const expirationDuration = 60 * 60 * 24 * 7;
    const maxNumberOfKeys = 1680;
    const keyPrice = ethers.utils.parseEther("1.0");
    const reveal = Math.floor(await time.latest()) + 60 * 60 * 24; // tomorrow!
    const recipient = "0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5"; // Random address as recipient!

    const { lock } = await unlock.createLock({
      expirationDuration,
      maxNumberOfKeys,
      keyPrice,
      name: "red packer",
    });
    const RedPacket = await ethers.getContractFactory("RedPacket");
    const hook = await RedPacket.deploy(lock.address, reveal);
    await hook.deployed();

    await (
      await lock.setEventHooks(
        hook.address, // _onKeyPurchaseHook
        ethers.constants.AddressZero, // _onKeyCancelHook
        ethers.constants.AddressZero, // _onValidKeyHook
        hook.address, // _onTokenURIHook
        ethers.constants.AddressZero, // _onKeyTransferHook
        ethers.constants.AddressZero, // _onKeyExtendHook
        ethers.constants.AddressZero // _onKeyGrantHook
      )
    ).wait();

    // Make the Hook a lock manager so it can withdraw funds!
    await (await lock.addLockManager(hook.address)).wait();

    // READY!
    // Let's now make purchases for all users!
    for (let i = 0; i < maxNumberOfKeys; i++) {
      const recipient = ethers.Wallet.createRandom().address;
      // And now let's do a full purchase which should *just work*
      await expect(
        lock.purchase(
          [keyPrice],
          [recipient],
          [recipient],
          [recipient],
          [0x0],
          {
            value: keyPrice,
          }
        )
      ).not.to.reverted;
    }

    const ranks = [];
    for (let j = 0; j <= maxNumberOfKeys; j++) {
      const rank = await hook.ranks(j);
      ranks[j] = rank.toNumber();
    }
    // Ok, done, let's move to the reveal phase!
    await time.increaseTo(reveal + 1);

    // Let's now check the prizes
    const prizesCounts = {};
    for (let i = 1; i <= maxNumberOfKeys; i++) {
      const prize = await hook.prize(i);
      if (!prizesCounts[prize]) {
        prizesCounts[prize] = 0;
      }
      prizesCounts[prize] += 1;
    }
    expect(prizesCounts["0"]).to.equal(1486);
    expect(prizesCounts["2"]).to.equal(99);
    expect(prizesCounts["8"]).to.equal(88);
    expect(prizesCounts["88"]).to.equal(6);
    expect(prizesCounts["168"]).to.equal(1);

    // Let's now have them withdraw?
    for (let i = 1; i <= maxNumberOfKeys; i++) {
      const prize = parseInt(await hook.prize(i), 10);
      if (prize > 0) {
        // Check the balance of the recipient
        const owner = await lock.ownerOf(i);
        const balanceBefore = await ethers.provider.getBalance(owner);
        expect(balanceBefore).to.equal(0);
        await hook.claimPrize(i);
        const balanceAfter = await ethers.provider.getBalance(owner);
        expect(balanceAfter).to.equal(
          ethers.utils.parseEther(prize.toString())
        );
      }
    }
  });
});
