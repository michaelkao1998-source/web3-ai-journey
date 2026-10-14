const hre = require("hardhat");
async function main() {
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const helloworld = await hre.ethers.getContractAt("Helloworld", contractAddress);
  const message = await helloworld.message();
  console.log(`Current message: ${message}`);
  
  const tx = await helloworld.updateMessage("Hello, Hardhat! Updated!");
  await tx.wait();
  console.log(`Message updated to: "Hello, Hardhat! Updated!"`);
}
main();

