import { ethers } from "hardhat";
import { expect } from "chai";
import { ERC4907Test, ERC4907Test__factory } from "../../types";
import dayjs from "dayjs";

let owner: any;
let addr1: any;
let addr2: any;

const twoDays = 2 * 24 * 60 * 60;

const setTime = async (time: number) => {
  await ethers.provider.send("evm_setNextBlockTimestamp", [time + twoDays]);
  await ethers.provider.send("evm_mine", []);
};

describe("ERC4907Test", () => {
  let contract: ERC4907Test;

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();

    const ERC4907DemoContract = (await ethers.getContractFactory(
      "ERC4907Test"
    )) as ERC4907Test__factory;
    contract = (await ERC4907DemoContract.deploy(
      "ERC4907",
      "4907"
    )) as ERC4907Test;
  });

  it("should set user to Bob", async () => {
    const tokenId = 1;

    await contract.mint(tokenId, owner.address);

    const expires = Math.floor(new Date().getTime() / 1000) + 1000;
    await contract.setUser(tokenId, addr1.address, BigInt(expires));

    const user_1 = await contract.userOf(tokenId);
    expect(user_1).to.equal(addr1.address);

    const owner_1 = await contract.ownerOf(tokenId);
    expect(owner_1).to.equal(owner.address);
  });

  it("should set user and check if expired", async () => {
    const tokenId = 2;
    const expiresInSeconds = 5; // Set the expiration to 5 seconds from now

    await contract.mint(tokenId, owner.address);

    const expires = Math.floor(new Date().getTime() / 1000) + expiresInSeconds;
    await contract.setUser(tokenId, addr2.address, BigInt(expires));

    const user_2 = await contract.userOf(tokenId);
    expect(user_2).to.equal(addr2.address);

    const releaseTimestamp = dayjs().add(1, "days").unix();

    await setTime(releaseTimestamp);

    const user_2_after_expire = await contract.userOf(tokenId);
    expect(user_2_after_expire).to.equal(ethers.ZeroAddress);
  });
});
