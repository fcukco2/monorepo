import { Contract } from "ethers";
import { artifacts, ethers } from "hardhat";
import path from "path";

async function main() {
  const MockSubgraph = await ethers.getContractFactory("MockSubgraph");
  const mockSubgraph = await MockSubgraph.deploy();
  await mockSubgraph.deployed();

  console.log("MockSubgraph address:", mockSubgraph.address);

  const Registry = await ethers.getContractFactory("Registry");
  const registry = await Registry.deploy();
  await registry.deployed();
  console.log("Registry address:", registry.address);

  const nctAddress = "0xD838290e877E0188a4A44700463419ED96c16107";
  const susiAddress = "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506";
  const usdcAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
  const CO2Burner = await ethers.getContractFactory("CO2Burner");
  const co2Burner = await CO2Burner.deploy(
    registry.address,
    usdcAddress,
    nctAddress,
    susiAddress
  );
  await co2Burner.deployed();
  console.log("CO2Burner address:", co2Burner.address);

  saveFrontendFiles(mockSubgraph, "MockSubgraph");
  saveFrontendFiles(registry, "Registry");
  saveFrontendFiles(co2Burner, "CO2Burner");
}

function saveFrontendFiles(token: Contract, name: string) {
  const fs = require("fs");
  const contractsDir = path.join(
    __dirname,
    "..",
    "frontend",
    "src",
    "contracts"
  );

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }
  const payload = {} as any;
  payload[name] = token.address;

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify(payload, undefined, 2)
  );

  const Artifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    path.join(contractsDir, name + ".json"),
    JSON.stringify(Artifact, null, 2)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
