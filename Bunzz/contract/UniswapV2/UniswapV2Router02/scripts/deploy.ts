import { ethers } from "hardhat";

async function main() {
  const factoryAddress: string = "0x249f2cc78bdc6e4ba68e237dcc30c291af575a09";
  const WETHAddress: string = "0x664aA5273306a66a0534Ee3B39812F42aA28d638";

  const UniswapV2Router02Contract = await ethers.deployContract("UniswapV2Router02", [
    factoryAddress,
    WETHAddress,
  ]);

  const contract = await UniswapV2Router02Contract.waitForDeployment();

  const deploymentTx = contract.deploymentTransaction()

  console.log(`Contract Address: ${await contract.getAddress()}`);
  console.log(`Tx Hash: ${deploymentTx?.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
