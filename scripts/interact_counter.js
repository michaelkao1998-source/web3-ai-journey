const fs = require("fs");
const path = require("path");
const hre = require("hardhat");

function getSavedAddress() {
  const addressFile = path.join(__dirname, "counter-address.json");

  try {
    const saved = JSON.parse(fs.readFileSync(addressFile, "utf8"));
    if (saved && saved.address) {
      console.log(`Using saved counter address: ${saved.address} on ${saved.network}`);
      return saved.address;
    }
  } catch (error) {
    // Ignore missing or invalid file; the script will deploy a new contract if needed.
  }

  return process.env.COUNTER_ADDRESS;
}

async function deployCounter() {
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
  return address;
}

async function ensureCounterAddress() {
  const savedAddress = getSavedAddress();

  if (!savedAddress) {
    console.log("No saved contract address found. Deploying a new Counter...");
    return deployCounter();
  }

  try {
    const contract = await hre.ethers.getContractAt("Counter", savedAddress, hre.ethers.provider);
    await contract.count();
    return savedAddress;
  } catch (error) {
    console.log(
      `Saved address ${savedAddress} is not valid on ${hre.network.name}. Deploying a new Counter...`
    );
    return deployCounter();
  }
}

async function main() {
  const counterAddress = await ensureCounterAddress();

  const [signer] = await hre.ethers.getSigners();
  const read = await hre.ethers.getContractAt("Counter", counterAddress, hre.ethers.provider);
  const write = await hre.ethers.getContractAt("Counter", counterAddress, signer);

  const before = await read.count();
  console.log(`Current count: ${before.toString()}`);

  const tx1 = await write.increment();
  await tx1.wait();
  console.log(`Count after increment: ${(await read.count()).toString()}`);

  const tx2 = await write.decrement();
  await tx2.wait();
  console.log(`Count after decrement: ${(await read.count()).toString()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

