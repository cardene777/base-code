import { ethers } from "hardhat";
import { expect } from "chai";
import { BigNumber } from "@ethersproject/bignumber";
import "@nomicfoundation/hardhat-chai-matchers";
import { ShareableERC721, ShareableERC721__factory } from "../../types";

let owner: any;
let addr1: any;
let addr2: any;
let contract: ShareableERC721;
const tokenIdToBeShared = 1;
const newTokenId = 0;

describe("ShareableERC721", () => {
  beforeEach(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];
    addr1 = signers[1];
    addr2 = signers[2];

    const ShareableERC721Factory = (await ethers.getContractFactory(
      "ShareableERC721"
    )) as ShareableERC721__factory;
    contract = (await ShareableERC721Factory.deploy(
      "ERC5023",
      "5023"
    )) as ShareableERC721;
  });

  it("should mint and set base URI", async () => {
    expect(await contract.name()).to.equal("ERC5023");
    expect(await contract.symbol()).to.equal("5023");

    await contract.setBaseURI("https://example.com/token/");

    await contract.mint(owner.address, tokenIdToBeShared);
    expect(await contract.ownerOf(tokenIdToBeShared)).to.equal(owner.address);
  });

  it("should share the NFT and emit the Share event", async () => {
    await contract.setBaseURI("https://example.com/token/");
    await contract.mint(owner.address, tokenIdToBeShared);

    const initialBalanceAddr1 = await contract.balanceOf(addr1.address);
    const initialBalanceAddr2 = await contract.balanceOf(addr2.address);

    await contract.connect(owner).share(addr1.address, tokenIdToBeShared);
    const newBalanceAddr1 = await contract.balanceOf(addr1.address);

    // The NFT should be shared to addr1 with a new token ID
    expect(newBalanceAddr1).to.equal(initialBalanceAddr1 + BigInt(1));

    const shareEvent = (
      await contract.queryFilter(contract.filters.Share())
    )[0];
    expect(shareEvent.args.from).to.equal(owner.address);
    expect(shareEvent.args.to).to.equal(addr1.address);
    expect(shareEvent.args.tokenId).to.equal(newTokenId);
    expect(shareEvent.args.derivedFromtokenId).to.equal(tokenIdToBeShared);
  });

  it("should not allow transferring of tokens", async () => {
    await contract.setBaseURI("https://example.com/token/");
    await contract.mint(owner.address, tokenIdToBeShared);
    await expect(
      contract
        .connect(owner)
        .transferFrom(owner.address, addr1.address, tokenIdToBeShared)
    ).to.be.revertedWith(
      "In this reference implementation tokens are not transferrable"
    );
    await expect(
      contract
        .connect(owner)
        .safeTransferFrom(owner.address, addr1.address, tokenIdToBeShared)
    ).to.be.revertedWith(
      "In this reference implementation tokens are not transferrable"
    );
  });
});
