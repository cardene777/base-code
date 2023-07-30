import { ethers } from "hardhat";
import { expect } from "chai";
import "@nomicfoundation/hardhat-chai-matchers";
import { RoyaltyNftTest, RoyaltyNftTest__factory } from "../../types";

let owner: any;
let addr1: any;
let addr2: any;

describe("testing for RoyaltyNft", () => {
  let contract: RoyaltyNftTest;

  beforeEach(async () => {
    const RoyaltyNftFactory = (await ethers.getContractFactory(
      "RoyaltyNftTest"
    )) as RoyaltyNftTest__factory;
    contract = (await RoyaltyNftFactory.deploy("RoyalNft", "RNFT")) as RoyaltyNftTest;
    // await contract.deployed();

    const signers = await ethers.getSigners();
    owner = signers[0];
    addr1 = signers[1];
    addr2 = signers[2];
  });

  it("should deploy with the correct name and symbol", async () => {
    const name = await contract.name();
    const symbol = await contract.symbol();

    expect(name).to.equal("RoyalNft");
    expect(symbol).to.equal("RNFT");
  });

  it("should support ERC721 interface", async () => {
    const supports = await contract.supportsInterface(
      "0x80ac58cd" // ERC721 interface ID
    );

    expect(supports).to.be.true;
  });

  it("should support ERC2981 interface", async () => {
    const supports = await contract.supportsInterface(
      "0x2a55205a" // ERC2981 interface ID
    );

    expect(supports).to.be.true;
  });

  it("should set default royalty correctly", async () => {
    const receiver = addr1.address;
    const feeNumerator = BigInt(1000); // 10% royalty
    const divNum = BigInt(10000);


    await contract.setDefaultRoyaltyForTest(receiver, feeNumerator);

    const tokenId = 1;
    const fixedSalePrice = ethers.FixedNumber.fromString("1");
    const salePrice = ethers.parseEther("1");

    const [royaltyReceiver, royaltyAmount] = await contract.royaltyInfo(
      tokenId,
      salePrice
    );

    expect(royaltyReceiver).to.equal(receiver);
    expect(royaltyAmount).to.equal((salePrice * feeNumerator) / divNum);
  });

  it("should set token royalty correctly", async () => {
      const receiver = addr1.address;
      const feeNumerator = BigInt(1000); // 10% royalty
      const divNum = BigInt(10000);

    const tokenId = 1;
      const salePrice = ethers.parseEther("1");

    await contract.setTokenRoyaltyForTest(tokenId, receiver, feeNumerator);

    const [royaltyReceiver, royaltyAmount] = await contract.royaltyInfo(
      tokenId,
      salePrice
    );

    expect(royaltyReceiver).to.equal(receiver);
    expect(royaltyAmount).to.equal(salePrice * feeNumerator / divNum);
  });

  it("should reset token royalty correctly", async () => {
    const receiver = addr1.address;
    const feeNumerator = BigInt(1000); // 10% royalty
    const divNum = BigInt(10000);

    const tokenId = 1;
    const salePrice = ethers.parseEther("1");

    await contract.setTokenRoyaltyForTest(tokenId, receiver,feeNumerator);

    const [royaltyReceiver, royaltyAmount] = await contract.royaltyInfo(
      tokenId,
      salePrice
    );

    expect(royaltyReceiver).to.equal(receiver);
    expect(royaltyAmount).to.equal(salePrice * feeNumerator / divNum);

    await contract.resetTokenRoyaltyForTest(tokenId);

    const [resetRoyaltyReceiver, resetRoyaltyAmount] =
      await contract.royaltyInfo(tokenId, salePrice);

    expect(resetRoyaltyReceiver).to.equal(ethers.ZeroAddress);
    expect(resetRoyaltyAmount).to.equal(0);
  });
});
