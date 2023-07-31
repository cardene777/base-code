import { ethers } from 'hardhat';
import { expect } from 'chai';
import { BigNumber } from '@ethersproject/bignumber';
import '@nomicfoundation/hardhat-chai-matchers';
import { Sample } from "../types";

let owner: any;
let addr1;
let addr2;
let initialOwnerBalance: bigint;

describe('testing for ERC20', async () => {
  let contract: Sample;

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];
    addr1 = signers[1];
    addr2 = signers[2];

    const tokenName = 'QYS Coin';
    const tokenSymbol = 'QYS';

    // Contractのデプロイ
    const Sample = await ethers.getContractFactory('Sample');
    contract = (await Sample.deploy(tokenName, tokenSymbol, owner.address)) as Sample;

    initialOwnerBalance = await contract.balanceOf(owner.address);
  });

  // ERC20Tokenの初期 Mint数とERC20Tokenの発行総量が等しいか
  describe('Deployment', function () {
    it('Should assign the total supply of tokens to the owner', async function () {
      const ownerBalance = await contract.balanceOf(owner.address);
      expect(await contract.totalSupply()).to.equal(ownerBalance);
    });
  });
});
