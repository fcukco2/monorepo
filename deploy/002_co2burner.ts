import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const deployFunction: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {

  const {deployments, getNamedAccounts} = hre;
  const {deploy} = deployments;
  const {deployer} = await getNamedAccounts();
  const registry = await deployments.get("Registry");
  const usdcAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
  const nctAddress = "0xD838290e877E0188a4A44700463419ED96c16107"
  const susiAddress = "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506"

  await deploy('CO2Burner', {
    contract: 'CO2Burner',
    from: deployer,
    args: [registry.address, usdcAddress, nctAddress, susiAddress],
    log: true,
  });

};

export default deployFunction;
deployFunction.tags = ['CO2Burner'];
deployFunction.dependencies = ["Forwarder"];
