import { ethers } from "hardhat";
import { expect } from "chai";
import { BigNumber } from "@ethersproject/bignumber";
import "@nomicfoundation/hardhat-chai-matchers";
import {
  ERC1363Mock,
  ERC1363Mock__factory,
  ERC1363ReceiverMock,
  ERC1363ReceiverMock__factory,
  ERC1363SpenderMock,
  ERC1363SpenderMock__factory,
} from "../../types";

let owner: any;
let addr1;
let addr2;
let initialOwnerBalance: bigint;

describe("testing for ERC1363", async () => {
  let contract: ERC1363Mock;
  let receiver: ERC1363ReceiverMock;
  let spender: ERC1363SpenderMock;

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];
    addr1 = signers[1];
    addr2 = signers[2];

    const initialBalance = ethers.parseEther("10000");
    const ERC1363MockFactory = (await ethers.getContractFactory(
      "ERC1363Mock"
    )) as ERC1363Mock__factory;
    contract = (await ERC1363MockFactory.deploy(
      "ERC1363",
      "1363",
      owner.address,
      initialBalance
    )) as ERC1363Mock;

    const ERC1363ReceiverMockFactory = (await ethers.getContractFactory(
      "ERC1363ReceiverMock"
    )) as ERC1363ReceiverMock__factory;
    receiver = (await ERC1363ReceiverMockFactory.deploy(
      ethers.toBeArray("0x88a7ca5c"),
      false
    )) as ERC1363ReceiverMock;

    const ERC1363SpenderMockFactory = (await ethers.getContractFactory(
      "ERC1363SpenderMock"
    )) as ERC1363SpenderMock__factory;
    spender = (await ERC1363SpenderMockFactory.deploy(
      ethers.toBeArray("0x7b04a2d0"),
      false
    )) as ERC1363SpenderMock;
  });

  it("checks initial balances", async () => {
    const initialBalance = ethers.parseEther("10000");
    expect(await contract.balanceOf(owner.address)).to.equal(initialBalance);
  });

  it("checks transfer and call", async () => {
    const transferAmount = ethers.parseEther("1");
      const callData = ethers.toBeArray("0x1234");
      const receiverAddress = await receiver.getAddress();
    await contract["transferAndCall(address,uint256,bytes)"](receiverAddress, transferAmount, callData);
    expect(await contract.balanceOf(await receiver.getAddress())).to.equal(transferAmount);
  });

  it("checks transfer and approve", async () => {
    const transferAmount = ethers.parseEther("1");
      const approveData = ethers.toBeArray("0x1234");
      const spenderAddress = await spender.getAddress();
    await contract["approveAndCall(address,uint256,bytes)"](
      spenderAddress,
      transferAmount,
      approveData
    );
    expect(await contract.allowance(owner.address, spenderAddress)).to.equal(
      transferAmount
    );
  });

  // Write more test cases here
});
