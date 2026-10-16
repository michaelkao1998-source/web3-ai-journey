const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");

function getSavedAddress() {
  const addressFile = path.join(__dirname, "counter-address.json");

  try {
    const saved = JSON.parse(fs.readFileSync(addressFile, "utf8"));
    if (saved && saved.address) {
      return saved.address;
    }
  } catch (error) {
    // Ignore missing or invalid file; the script will guide the user to deploy first.
  }

  return process.env.COUNTER_ADDRESS;
}

async function main() {
  const counterAddress = getSavedAddress();

  if (!counterAddress) {
    throw new Error(
      "Counter address not found. Deploy it first with: node scripts/deploy_counter.js or npx hardhat run scripts/deploy_counter.js --network localhost"
    );
  }

  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const signer = await provider.getSigner(0);
  const CounterArtifact = require("../artifacts/contracts/Counter.sol/Counter.json");

  const read = new ethers.Contract(counterAddress, CounterArtifact.abi, provider);
  const write = new ethers.Contract(counterAddress, CounterArtifact.abi, signer);

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

