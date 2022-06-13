import React, {
  useEffect
} from 'react'
import {
  ethers
} from 'ethers';
import {
  Biconomy
} from "@biconomy/mexa";

// Use States Rather Than This Type Of Variables.
let contractAddress = "0x54F302206A71Bf38b900990e3aB29324183Ce93F";
let biconomyAPI = "Cvdppu-3p.158b9f55-24f0-4cbf-b240-5e5e744b43f5";
let userAddress, biconomy, contract;
let isLoaded=false;

let contractABI = [{
    "inputs": [{
      "internalType": "address",
      "name": "_trustedForwarder",
      "type": "address"
    }],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "getMessage",
    "outputs": [{
      "internalType": "string",
      "name": "",
      "type": "string"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{
      "internalType": "address",
      "name": "forwarder",
      "type": "address"
    }],
    "name": "isTrustedForwarder",
    "outputs": [{
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{
      "internalType": "string",
      "name": "newMessage",
      "type": "string"
    }],
    "name": "setMessage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "trustedForwarder",
    "outputs": [{
      "internalType": "address",
      "name": "",
      "type": "address"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "versionRecipient",
    "outputs": [{
      "internalType": "string",
      "name": "",
      "type": "string"
    }],
    "stateMutability": "view",
    "type": "function"
  }
]

const App = () => {

  useEffect(() => {
    const init = async () => {
      const provider_Metamask = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider_Metamask.getSigner();
      userAddress = await signer.getAddress();
      biconomy = new Biconomy(new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/80ec67d0b3ac44b7b168c38950684880"), {
        walletProvider: window.ethereum,
        apiKey: biconomyAPI,
        debug: true
      });

      biconomy.onEvent(biconomy.READY, async () => {
        contract = new ethers.Contract(contractAddress,
          contractABI, biconomy.getSignerByAddress(userAddress));
        console.log(await contract.getMessage());
        //let contractInterface = new ethers.utils.Interface(contractABI);
        isLoaded=true;
      }).onEvent(biconomy.ERROR, (error, message) => {});
    }
    init();
  })

  const setMessage = async () => {
    if (isLoaded!=false) {
      let {
        data
      } = await contract.populateTransaction.setMessage("Give Me One Bitcoin I Will Give You 1 Dollar"); // Here One Thing To Note Is That Only That Method Will Be Execute Without Gas Which Is Specified In Biconomy.
      console.log(data);
      let provider = biconomy.getEthersProvider();
      // console.log(provider);
      let gasLimit = await provider.estimateGas({ 
        to: contractAddress,
        from: userAddress,
        data: data
      });
  
      let txParams = {
        data: data,
        to: contractAddress,
        from: userAddress,
        // gasLimit: gasLimit, You Can Give Gaslimit But Sometime Transaction Fails Just Because Of Less Gas.
        signatureType: "EIP712_SIGN"
      };
  
      try {
       let tx = await provider.send("eth_sendTransaction", [txParams])
        console.log("Transaction hash : ", tx);
      } catch (err) {
        console.log("handle errors like signature denied here");
        console.log(err);
      }  
    }else{
      alert("Wait, Biconomy Is Not Loaded");
    }
  }

  return ( 
    <button onClick={()=>setMessage()}> Click Here </button>
  )
}

export default App;