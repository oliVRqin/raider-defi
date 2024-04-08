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
  const RaiderStaking = await hre.ethers.getContractFactory("RaiderStaking");

  const stakingToken = '0x426a56f6923c2b8a488407fc1b38007317ecafb1';
  const rewardToken = '0xcd7361ac3307D1C5a46b63086a90742Ff44c63B3'; 
  
  const raiderStaking = await RaiderStaking.deploy(stakingToken, rewardToken);

  await raiderStaking.deployed();

  console.log("StakingRaiderETH deployed to:", raiderStaking.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
