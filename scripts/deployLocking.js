// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const StakingLocking = await hre.ethers.getContractFactory("RaiderStakingLocking");

  const stakingToken = '0xcd7361ac3307D1C5a46b63086a90742Ff44c63B3';
  const rewardToken = '0x34d4ab47Bee066F361fA52d792e69AC7bD05ee23';
  
  const stakingLocking = await StakingLocking.deploy(stakingToken, rewardToken);

  await stakingLocking.deployed();

  console.log("StakingLocking deployed to:", stakingLocking.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
