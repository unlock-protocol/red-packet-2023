// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "@unlock-protocol/contracts/dist/PublicLock/IPublicLockV12.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


error NOT_AUTHORIZED();
error TOO_LATE();
error ALREADY_CLAIMED();

contract RedPacket {

  address public lock;
  uint public revealTime;
  uint public offset;
  mapping(uint => uint) public ranks;
  mapping(uint => bool) public redeemed;


  constructor(address _lock, uint _revealTime) {
    lock = _lock;
    revealTime = _revealTime;
  }

  /**
   * Price is the same for everyone... 
   * but we fail if signer of data does not match the lock's password.
   */
  function keyPurchasePrice(
    address, /* from */
    address, /* recipient */
    address, /* referrer */
    bytes calldata /* data */
  ) external view returns (uint256 minKeyPrice) {
    return IPublicLock(msg.sender).keyPrice();
  }

  /**
   * 
   */
  function onKeyPurchase(
    uint256 tokenId, /* tokenId */
    address from, /* from */
    address, /* recipient */
    address, /* referrer */
    bytes calldata, /* data */
    uint256, /* minKeyPrice */
    uint256 /* pricePaid */
  ) external {
    if (block.timestamp > revealTime) {
      revert TOO_LATE();
    }
    if (msg.sender != lock) {
      revert NOT_AUTHORIZED();
    }
    // We compute an offset for the final tally
    offset = uint256(keccak256(abi.encodePacked(block.timestamp + tokenId, from))) % 8888888; // Sets the offset!
    // We "randomize" an array that can help us compute winners!
    uint randomIndex = offset % tokenId; // Selects a random index
    if(ranks[randomIndex] > 0) {
      // If we already have a value, swap it
      ranks[tokenId - 1] = ranks[randomIndex]; // Push existing to last
      ranks[randomIndex] = tokenId;
    } else {
      ranks[randomIndex] = tokenId;
    }
    
  }

  /**
   * hashed token id      |   count    |  prize   | cost  | accumulated
   * 0                    |   1        |  168     | 168   | 168
   * 1-6                  |   6        |  88      | 528   | 696
   * 7-94                 |   88       |  8       | 704   | 1400
   * 95-193               |   99       |  2       | 198   | 1598
   * Above                |   all      |  0       | 0     | 1598
   */
  function prize(uint256 tokenId) public view returns (uint) {
    address owner = IPublicLock(lock).ownerOf(tokenId);
    if (owner != address(0) && block.timestamp > revealTime) {
      // Get the index for this token using the offset and the randomized array
      uint index = (offset + tokenId)  % IPublicLock(lock).totalSupply();
      if (ranks[index] == 1) {
        return 168;
      } else if (ranks[index] < 8) {
        return 88;
      } else if (ranks[index] < 96) {
        return 8;
      } else if (ranks[index] < 195) {
        return 2;
      } 
    }
    return 0;
  }

  /**
   * TokenURI function.
   */
  function tokenURI(
    address, // the address of the lock
    address,    // the msg.sender issuing the call
    address owner,    // the owner of the key
    uint256 keyId,    // the id (tokenId) of the key (if applicable)
    uint    // the key expiration timestamp
  ) external view returns(string memory) {
    // Not owned? No data!
    if(owner == 0x0000000000000000000000000000000000000000) {
      return string(
        abi.encodePacked(
            "data:application/json;base64,",
            Base64.encode('{}')
        )
      );
    }
    string memory image = "teaser";
    string memory attributes = '[]';
    if (block.timestamp > revealTime) {
      uint prizeValue = prize(keyId);
      image = Strings.toString(prizeValue);
      attributes = string( abi.encodePacked('[ {"trait_type": "Prize", "value": ', image, '}, {"trait_type": "Redeemed", "value": ', redeemed[keyId] ? 'true' : 'false', '} ]'));
    }

    bytes memory metadata = abi.encodePacked(
      '{',
        '"description": "A Red Packet for the Lunar New Year of 2023!",', 
        '"external_url": "https://red-packet.unlock-protocol.com/",',
        '"image": "ipfs://QmZ36mis8daTmXWeBcTjfHCSSeQMyWcJH8mNvyB6i8KAXb/',image,'.svg",',
        '"name": "Red Packet #', Strings.toString(keyId),'",',
        '"attributes":',attributes,
      '}');

    return string(
      abi.encodePacked(
          "data:application/json;base64,",
          Base64.encode(metadata)
      )
    );
  }

  /**
   * Function to claim prize!
   */
  function claimPrize(uint256 tokenId) external payable {
    if (block.timestamp > revealTime) {
      // MARK AS REDEMEED FIRST!
      redeemed[tokenId] = true;
      uint prizeValue = prize(tokenId) * 1 ether;
      address owner = IPublicLock(lock).ownerOf(tokenId);
      if (prizeValue > 0 && owner != address(0)) {
        IPublicLock(lock).withdraw(address(0), payable(owner), prizeValue);
      }
    }
  }
}