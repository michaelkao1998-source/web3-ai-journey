const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");

async function main() {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const signer = await provider.getSigner(0);
  const CounterArtifact = require("../artifacts/contracts/Counter.sol/Counter.json");
  const counterFactory = new ethers.ContractFactory(
    CounterArtifact.abi,
    CounterArtifact.bytecode,
    signer
  );

  const counter = await counterFactory.deploy();
  await counter.waitForDeployment();

  const address = await counter.getAddress();
  const addressFile = path.join(__dirname, "counter-address.json");

  fs.writeFileSync(
    addressFile,
    JSON.stringify({ network: "localhost", address }, null, 2)
  );

  console.log(`Counter deployed to ${address} on localhost`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


