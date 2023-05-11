import logo from './logo.svg';
import './App.css';
import {ethers} from "ethers";
import {useState, useEffect} from "react";
import FaucetAbi from "./abis/Faucet.json";
import Swal from 'sweetalert2';

const faucetContractAddress = "0xEeC9a73B954108Bff4a2bB35A8e9aD1Ff446b323"; // kendi faucet kontrat adresinizle degistirin.

function App() {

  const[walletAddress,setWalletAddress] = useState("");
  const[provider,setProvider] = useState("");
  
   useEffect(() => {
      connectWallet();
   },[walletAddress]);


  const connectWallet = async () => {
    if(typeof window.ethereum != "undefined"){
      try{
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts");

        setProvider(provider);
        setWalletAddress(accounts[0]);

      } catch(err){
        console.log(err);
      }
    }
  }

  const getTokens = async () => {
   
    try{
      const contract = new ethers.Contract(faucetContractAddress,FaucetAbi,provider.getSigner()); // 1.contract address, 2.abi,  3.provider

      const transaction = await contract.requestToken();
      console.log("transaction", transaction);

      if(transaction.hash){
        Swal.fire({
          title: 'Success!',
          html:
          `Check transaction hash,
            <a href="https://sepolia.etherscan.io/tx/${transaction.hash}" target="_blank">Etherscan TX Hash</a>
          at etherscan`,
          icon: 'success',
          confirmButtonText: 'Ok'
        })
      }
    } catch(err){
      console.log(err);

      Swal.fire({
        title: 'Error!',
        text: err.message,
        icon: 'error',
        confirmButtonText: 'Ok'
      })
    }
  }

  return (
    <>
    <nav className="navbar">
      <div className="container">
          <div className="navbar-brand">
            <h1 className="navbar-item is-size-4">MyToken (MTK) Faucet</h1>
          </div>
          <div id="navbar-menu" className="navbar-menu">
            <div className="navbar-end">
              <button className="button is-white connect-wallet" onClick={connectWallet}>
                
                {walletAddress ? `Connected: ${walletAddress.substring(0,6)}... ${walletAddress.substring(38)}` : "Connect Wallet"}
                </button>
            </div>
          </div>
      </div>
    </nav>

    <section className='hero'>
      <div className='faucet-hero-body'>
          <div className='box'>
            <input 
              type="text" 
              className="input" 
              placeholder='Enter your wallet address (0x....)'
              defaultValue={walletAddress}
              />
            <button className='button' onClick={getTokens}>Get Tokens</button>
          </div>
      </div>
    </section>
    </>
  );
}

export default App;
