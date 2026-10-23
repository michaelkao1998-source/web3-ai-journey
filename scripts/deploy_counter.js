const fs = require("fs");
const path = require("path");
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const Counter = await hre.ethers.getContractFactory("Counter", deployer);
  const counter = await Counter.deploy();
  await counter.waitForDeployment();

  const address = await counter.getAddress();
  const addressFile = path.join(__dirname, "counter-address.json");

  fs.writeFileSync(
    addressFile,
    JSON.stringify({ network: hre.network.name, address }, null, 2)
  );

  console.log(`Counter deployed to ${address} on ${hre.network.name}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


