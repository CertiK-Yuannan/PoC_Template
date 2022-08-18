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

  // Deploy exploit contract with intialized parameters from config.yml
  const exploit = await new Exploit__factory(signer).deploy();
  console.log("Exploit contract deployed to: ",exploit.address)
  
  // Show balance
  // const WBNB = IERC20__factory.connect(config['address']['wbnb'],signer);
  // console.log("Attacker WBNB balance:", hre.ethers.utils.formatUnits(await WBNB.balanceOf(signer.address),await WBNB.decimals()))
  

  // Execute any function
  const functionTx = await exploit.executeAnyFunction();
  console.log("Execute some function: ",functionTx.hash)
  const transactionResult = await functionTx.wait()
  console.log(transactionResult)

  // Execute exploit contract
  const exploitTx = await exploit.attack({value: ethers.utils.parseEther("500")});
  console.log("Exploiting... transcation: ",exploitTx.hash)
  await exploitTx.wait()

  // Display result
  // console.log("Exploit complete.")
  // console.log("Attacker WBNB balance:",hre.ethers.utils.formatUnits(await WBNB.balanceOf(signer.address),await WBNB.decimals()))
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
