import { ethers } from "hardhat";
import { Registry__factory } from "../typechain-types";
import * as output from "../output.json";

async function main() {
  const [deployer] = await ethers.getSigners();
  const registry = Registry__factory.connect(
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    deployer
  );

  const tx = await registry.addAllProjectTokens(output.baseMap);
  await tx.wait();
  output.categoryMap.forEach(async (element) => {
    if (element.key === undefined) return;
    const tx2 = await registry.addProjectTokenByCategory(
      element.key,
      element.value
    );
    await tx2.wait();
  });
  output.countryMap.forEach(async (element) => {
    const tx3 = await registry.addProjectTokenByCountry(
      element.key,
      element.value
    );
    await tx3.wait();
  });

  //const result = await registry.findBestProjectTokens("");
  const result2 = await registry.allProjectTokens(0);
  console.log(result2);
  //console.log(result);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
