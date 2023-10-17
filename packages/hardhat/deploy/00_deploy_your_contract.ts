import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network goerli`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const ownerAddress = deployer;

  const eventGems = await deploy("EventGems", {
    from: deployer,
    // Contract constructor arguments
    args: [ownerAddress],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  const eventGemsContract = await hre.ethers.getContract("EventGems", deployer);

  await eventGemsContract.grantRole(
    hre.ethers.utils.keccak256(hre.ethers.utils.toUtf8Bytes("MINTER_ROLE")),
    eventGems.address,
  );

  await eventGemsContract.grantRole(
    hre.ethers.utils.keccak256(hre.ethers.utils.toUtf8Bytes("MINTER_ROLE")),
    "0x7E77A121d7B374D46CD25d9772bbdDC56576c413",
  );
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["EventGems"];
