// Import needed interface factories
// Theses interface factories will be generated automatically according to the exploit.sol and interfaces file 
import {Exploit__factory} from "../typechain";
import hre, { ethers } from "hardhat"
import YAML from 'yaml'
import fs from 'fs'

async function main() {
  // Read parameters from config.yml
  const config_file = fs.readFileSync('config.yml', 'utf8');
  const config = YAML.parse(config_file);

  // Setup account
  const [signer] = await hre.ethers.getSigners();
  console.log("Account balance:", (await signer.getBalance()).toString());

  // Deploy exploit contract with intialized parameters from config.yml
  const exploit = await new Exploit__factory(signer).deploy();
  console.log("Exploit contract deployed to: ",exploit.address)
  
  // Execute exploit contract
  const exploitTx = await exploit.attack({value: ethers.utils.parseEther("500")});
  console.log("Exploiting... transcation: ",exploitTx.hash)
  const exploirtReceipt = await exploitTx.wait()
  console.log(exploirtReceipt)

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
