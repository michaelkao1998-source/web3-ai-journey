const { ethers } = require("hardhat");

async function main() {
  const HelloWorld = await ethers.getContractFactory("Helloworld");
  const contract = await HelloWorld.deploy("Hello, Hardhat!");
  await contract.waitForDeployment();

  console.log(`Helloworld deployed to ${await contract.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
