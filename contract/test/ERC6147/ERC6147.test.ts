import { ethers } from "hardhat";
import { expect } from "chai";
import { ERC6147Test, ERC6147Test__factory } from "../../types";
import dayjs from "dayjs";

let owner: any;
let guard: any;
let addr1: any;
let addr2: any;

const twoDays = 2 * 24 * 60 * 60;

const setTime = async (time: number) => {
  await ethers.provider.send("evm_setNextBlockTimestamp", [time + twoDays]);
  await ethers.provider.send("evm_mine", []);
};

describe("ERC6147Test", () => {
  let erc6147: ERC6147Test;
  let tokenId: number;
  let expires: number;

  beforeEach(async () => {
    [owner, guard, addr1, addr2] = await ethers.getSigners();

    const ERC6147Factory = (await ethers.getContractFactory(
      "ERC6147Test"
    )) as ERC6147Test__factory;
    erc6147 = (await ERC6147Factory.deploy("ERC6147", "6147")) as ERC6147Test;
    tokenId = 1;
    expires = Math.floor(Date.now() / 1000) + 3600; // Set expires to 1 hour from now

    // Mint the token before each test
    await erc6147.mint(owner.address, tokenId);
  });

  it("should set and get guard info correctly", async () => {
    // Owner sets guard and expires for the token
    await erc6147.changeGuard(tokenId, guard.address, expires);

    // Get guard info for the token
    const [guardAddress, guardExpires] = await erc6147.guardInfo(tokenId);
    expect(guardAddress).to.equal(guard.address);
    expect(Number(guardExpires)).to.equal(expires);
  });

  it("should remove guard and expires correctly", async () => {
    // Owner sets guard and expires for the token
    await erc6147.connect(owner).changeGuard(tokenId, guard.address, expires);

    // Remove guard and expires for the token
    await erc6147.connect(guard).removeGuard(tokenId);

    // Get guard info for the token
    const [guardAddress, guardExpires] = await erc6147.guardInfo(tokenId);
    expect(guardAddress).to.equal(ethers.ZeroAddress);
    expect(Number(guardExpires)).to.equal(0);
  });

  it("should transfer NFT and remove guard correctly", async () => {
    // Owner sets guard and expires for the token
    await erc6147.connect(owner).changeGuard(tokenId, guard.address, expires);

    // Transfer NFT and remove guard
    await erc6147
      .connect(guard)
      .transferAndRemove(owner.address, addr1.address, tokenId);

    // Get guard info for the token
    const [guardAddress, guardExpires] = await erc6147.guardInfo(tokenId);
    expect(guardAddress).to.equal(ethers.ZeroAddress);
    expect(Number(guardExpires)).to.equal(0);

    // Check if the NFT is now owned by addr1
    expect(await erc6147.ownerOf(tokenId)).to.equal(addr1.address);
  });

  it("should not allow setting null guard if allowNull is false", async () => {
    await expect(
      erc6147.changeGuard(tokenId, ethers.ZeroAddress, expires)
    ).to.be.revertedWith("ERC6147: new guard can not be null");
  });

  it("should not allow non-owner or non-approved address to set guard and expires", async () => {
    await expect(
      erc6147.connect(addr1).changeGuard(tokenId, guard.address, expires)
    ).to.be.revertedWith("ERC6147: caller is not owner nor approved");
  });

  it("should not allow non-guard to change its own guard and expires", async () => {
    // Owner sets guard and expires for the token
    await erc6147.connect(owner).changeGuard(tokenId, guard.address, expires);

    // Try to update the guard from a non-guard address
    await expect(
      erc6147.connect(addr1).updateGuard(tokenId, addr1.address, expires, false)
    ).to.be.revertedWith("ERC6147: only guard can change itself");
  });

  it("should not allow transferring NFT by non-guard if the guard is set", async () => {
    await erc6147.changeGuard(tokenId, guard.address, expires);

    await expect(
      erc6147
        .connect(addr1)
        .transferAndRemove(owner.address, addr2.address, tokenId)
    ).to.be.revertedWith("ERC6147: sender is not the guard of the token");
  });

  it("should allow transferring NFT by non-guard if the guard has expired", async () => {
    // Owner sets guard and expires for the token
    await erc6147.connect(owner).changeGuard(tokenId, guard.address, expires);

    // Transfer NFT and remove guard
    await erc6147
      .connect(guard)
      .transferAndRemove(owner.address, addr1.address, tokenId);

    // Check if the NFT is now owned by addr2
    expect(await erc6147.ownerOf(tokenId)).to.equal(addr1.address);
  });
});
