import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

import dotenv from 'dotenv';
dotenv.config();

const deployFunction: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {

  const {deployments, getNamedAccounts} = hre;
  const {deploy} = deployments;
  const {deployer} = await getNamedAccounts();

  await deploy('Registry', {
    contract: 'Registry',
    from: deployer,
    args: [],
    log: true,
    skipIfAlreadyDeployed: true,
  });

};

export default deployFunction;
deployFunction.tags = ['Registry'];
