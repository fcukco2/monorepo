import {CO2Burner, IERC20, Registry} from "../typechain-types";
import * as output from "../output.json";
import {ethers} from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const usdcAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
  const usdc = await ethers.getContractAt("IERC20", usdcAddress) as IERC20;

  const burnerAddress = "0xE66EDdB497af36eF1C52EE2265155e6Edf2ABA05"
  const burner = await ethers.getContractAt("CO2Burner", burnerAddress) as CO2Burner

  console.log(`USDC Balance: ${await usdc.balanceOf(deployer.address)}`)
  console.log(`USDC approval: ${await usdc.allowance(deployer.address, burnerAddress)}`)
  // const tt = await usdc.approve(burnerAddress, ethers.utils.parseUnits("100", 6));
  // await tt.wait()
  // console.log(tt.hash)
  const tx = await burner.burnCO2(ethers.utils.parseUnits("3", 5), "CNXXX")
  await tx.wait()
  console.log(`TX: ${tx.hash}`)
}



main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});