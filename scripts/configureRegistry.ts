import { ethers } from "hardhat";
import { Registry, Registry__factory } from "../typechain-types";
import * as output from "../output.json";

async function main() {
  const [deployer] = await ethers.getSigners();
  const registry = Registry__factory.connect(
    "0x1646834B4fdDbD9749338A4C23C7a8110861e1C8",
    deployer
  );

  await configure(registry);

  //const result = await registry.findBestProjectTokens("");

  //const result2 = await registry.allProjectTokens(0);
  const code = await ethers.provider.getCode(
    "0x1646834B4fdDbD9749338A4C23C7a8110861e1C8"
  );
  console.log(`Code: ${code}`);
  //console.log(result);
}

async function configure(registry: Registry) {
  async function processCategory(
    memo: any,
    element:
      | { key: string; value: string[] }
      | { key?: undefined; value: string[] }
  ) {
    await memo;
    if (element.key === undefined) return;
    const tx2 = await registry.addProjectTokenByCategory(
      element.key,
      element.value
    );
    await tx2.wait();

    console.log(`${element.key} TX: ${tx2.hash}`);
  }

  async function processCountry(
    memo: any,
    element:
      | { key: string; value: string[] }
      | { key?: undefined; value: string[] }
  ) {
    await memo;
    if (element.key === undefined) return;
    const tx3 = await registry.addProjectTokenByCountry(
      element.key,
      element.value
    );
    await tx3.wait();
    console.log(`${element.key} TX: ${tx3.hash}`);
  }

  const tx = await registry.addAllProjectTokens(output.baseMap);
  await tx.wait();
  console.log(`Base Map TX: ${tx.hash}`);

  await output.categoryMap.reduce(processCategory, undefined);
  await output.countryMap.reduce(processCountry, undefined);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
