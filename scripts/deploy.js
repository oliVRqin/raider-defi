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
  const Aurum = await hre.ethers.getContractFactory("AURUMToken");
  const Raider = await hre.ethers.getContractFactory("RAIDERToken");
  const Staking = await hre.ethers.getContractFactory("RaiderStaking");
  const StakingLocking = await hre.ethers.getContractFactory("RaiderStakingLocking");
  const aurum = await Aurum.deploy();
  const raider = await Raider.deploy();
  const staking = await Staking.deploy(aurum.address, raider.address);
  const stakingLocking = await StakingLocking.deploy(raider.address, aurum.address);

  await aurum.deployed();
  await raider.deployed();
  await staking.deployed();
  await stakingLocking.deployed();

  console.log("AURUM deployed to:", aurum.address);
  console.log("RAIDER deployed to:", raider.address);
  console.log("Staking deployed to:", staking.address);
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
