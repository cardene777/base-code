import { ethers } from 'hardhat';
import { expect } from 'chai';
import { BigNumber } from '@ethersproject/bignumber';
import '@nomicfoundation/hardhat-chai-matchers';
import { Sample } from "../types";

let owner: any;
let addr1;
let addr2;
let initialOwnerBalance: bigint;

const decimals = BigNumber.from(10).pow(18);
const mintAmount = BigNumber.from(1e9).mul(decimals);

// ロール検証用アドレス
const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';
const PAUSER_ROLE = '0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a';
const BURNER_ROLE = '0x3c11d16cbaffd01df69ce1c404f6340ee057498f5f00246190ea54220576a848';

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
