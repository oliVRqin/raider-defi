import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import RaiderAurumToken from './artifacts/contracts/RaiderAurumToken.sol/RaiderAurumToken.json';
import { Input, Button, Grid } from 'semantic-ui-react';
import { maxAllowance, roundedNum } from '../helpers';

// Update with the contract address logged out to the CLI when it was deployed 

const AurumAdmin = ( {userAddress, setProvider, aurumPrice} ) => {
  // const [userAddress, setUserAddress] = useState("");
  const [supply, setSupply] = useState("");
  const [symbol, setSymbol] = useState("");
  const [paused, setPaused] = useState();
  const [minter, setMinter] = useState();
  const [pauser, setPauser] = useState();
  const [userBalance, setUserBalance] = useState();
  const [mintTargetAddress, setMintTargetAddress] = useState();
  const [mintAmount, setMintAmount] = useState();
  const [burnTargetAddress, setBurnTargetAddress] = useState();
  const [burnAmount, setBurnAmount] = useState();
  const [transferTargetAddress, setTransferTargetAddress] = useState();
  const [transferAmount, setTransferAmount] = useState();
  const [allowance, setAllowance] = useState();
  const [dilutedValue, setdilutedValue] = useState();

  const tokenAddress = process.env.NEXT_PUBLIC_AURUM;

  const setContract = (data) => {
    return new ethers.Contract(tokenAddress, RaiderAurumToken.abi, data);
  }

  // call the smart contract, read the current token supply
  const fetchTotalSupply = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const contract = setContract(setProvider());
      try {
        const data = await contract.totalSupply();
        setSupply((ethers.utils.formatEther(data)));
      } catch (err) {
        console.log("error: ", err);
      }
    }
  }

  // Call the smart contract, get the token symbol
  const fetchSymbol = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const contract = setContract(setProvider());
      try {
        const data = await contract.symbol();
        setSymbol(`$${data}`);
      } catch (err) {
        console.log("error: ", err);
      }
    }
  }

  // Check if the contract is paused
  const fetchPaused = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const contract = setContract(setProvider());
      try {
        const data = await contract.paused();
        setPaused(data.toString());
      } catch (err) {
        console.log("error: ", err);
      }
    }
  }

  // Get the hash for the minter of the contract
  const fetchMinter = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const contract = setContract(setProvider());
      try {
        const data = await contract.MINTER_ROLE();
        return(data);
      } catch (err) {
        console.log("error: ", err);
      }
    }
  }

  // Get the hash for the pauser of the contract
  const fetchPauser = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const contract = setContract(setProvider());
      try {
        const data = await contract.PAUSER_ROLE();
        return(data);
      } catch (err) {
        console.log("error: ", err);
      }
    }
  }

  // See if the logged in wallet has certain roles
  const checkUserRole = async (role) => {
    if (!userAddress) return;
    let hash;
    
    if (role === "minter") {
      hash = await fetchMinter();
    } else if (role === "pauser") {
      hash = await fetchPauser();
    }
    
    if (typeof window.ethereum !== 'undefined') {
      const contract = setContract(setProvider());
      try {
        const data = await contract.hasRole(hash, userAddress);
        if (role === "minter") {
          setMinter(data.toString());
        } else if (role === "pauser") {
          setPauser(data.toString());
        }
      } catch (err) {
        console.log("error: ", err);
      }
    }
  }

  // Get the token balance for an address
  const fetchBalance = async (address) => {
    if (typeof window.ethereum !== 'undefined') {
      const contract = setContract(setProvider());
      try {
        const data = await contract.balanceOf(address);
        return(ethers.utils.formatEther(data));
      } catch (err) {
        console.log("error: ", err);
      }
    }
  }

  // Get the current user's balance
  const fetchUserBalance = async () => {
    if (!userAddress) return;
    const balance = await fetchBalance(userAddress);
    setUserBalance(balance);
  }

  // Toggle the contract paused or unpaused
  const pauseToggle = async () => {
    if (!userAddress) return;
    if (typeof window.ethereum !== 'undefined') {
      const provider = setProvider();
      const signer = provider.getSigner();
      const contract = setContract(signer);
      if (paused === "true") {
        const transaction = await contract.unpause();
        await transaction.wait();
      } else if (paused === "false") {
        const transaction = await contract.pause();
        await transaction.wait();
      }
      
      await fetchPaused();
    }
  }

  // Create more tokens and send them to an address
  const mintTokens = async (address, amount) => { 
    if (!userAddress) return;
    if (typeof window.ethereum !== 'undefined') {
      const provider = setProvider();
      const signer = provider.getSigner();
      const contract = setContract(signer);
      const transaction = await contract.mint(address, ethers.utils.parseEther(amount));
      await transaction.wait();
    }
  }

  // Burn tokens from the current users address
  const burnTokens = async (amount) => { 
    if (!userAddress) return;
    if (typeof window.ethereum !== 'undefined') {
      const provider = setProvider();
      const signer = provider.getSigner();
      const contract = setContract(signer);
      const transaction = await contract.burn(ethers.utils.parseEther(amount));
      await transaction.wait();
    }
  }

  // Burn tokens from another address that has given allowance permission
  const burnTokensAddress = async (address, amount) => { 
    if (!userAddress) return;
    if (typeof window.ethereum !== 'undefined') {
      const provider = setProvider();
      const signer = provider.getSigner();
      const contract = setContract(signer);
      const transaction = await contract.burnFrom(address, ethers.utils.parseEther(amount));
      await transaction.wait();
    }
  }

  // Run one of the two burn functions depending on if an address is specified
  const burnHandler = async () => {
    if (!userAddress) return; 
    if (!burnTargetAddress) {
      await burnTokens(burnAmount);
    } else {
      await burnTokensAddress(burnTargetAddress, burnAmount);
    }
    updateBalances();
  }

  // Transfer tokens from the current users wallet to another wallet
  const transfer = async (address, amount) => {
    if (!userAddress) return;
    if (typeof window.ethereum !== 'undefined') {
      const provider = setProvider();
      const signer = provider.getSigner();
      const contract = setContract(signer);
      const transaction = await contract.transfer(address, ethers.utils.parseEther(amount));
      await transaction.wait();
    }
  }

  const addAllowance = async () => {
    if (!userAddress) return;
    if (typeof window.ethereum !== 'undefined') {
      const provider = setProvider();
      const signer = provider.getSigner();
      const contract = setContract(signer);
      // TK same number for now, maybe infinite later
      const transaction = await contract.approve(tokenAddress, maxAllowance);
      await transaction.wait();
      checkAllowance();
    }
  }

  const checkAllowance = async () => {
    if (!userAddress) return; 
    if (typeof window.ethereum !== 'undefined') {
      const contract = setContract(setProvider());
      try {
        const data = await contract.allowance(userAddress, tokenAddress);
        setAllowance(ethers.utils.formatEther(data));
      } catch (err) {
        console.log(err);
      }
    }
  }

  // Update the total supply and the current user's balance
  const updateBalances = () => {
    fetchTotalSupply();
    if (userAddress) {
      fetchUserBalance();
    }
  }

  const transferHandler = () => {
    if (allowance >= transferAmount) {
      transfer(transferTargetAddress, transferAmount)
    } else if (allowance < transferAmount) {
      addAllowance();
    }
  }

  const pauseText = () => {
    if (paused === 'true') {
      return "Unpause";
    } else if (paused === 'false') {
      return "Pause";
    }
  }

  const pauserCheck = () => {
    if (pauser === "true") {
      return (
        <div className="dangerZone">
          <h2>DANGER ZONE</h2>
          <Button color="red" onClick={pauseToggle}>{pauseText()} {symbol} Token</Button>
        </div>
      )
    }
  }

  const minterCheck = () => {
    if (minter === "true") {
      return (
        <div>
          <h2>Minting</h2>
          <div className="inputBox">
            <p>Target Address</p>
            <Input fluid onChange={(e) => setMintTargetAddress(e.target.value)} />
          </div>
          <div className="inputBox">
            <p>Token amount</p>
            <Input fluid onChange={(e) => setMintAmount(e.target.value)} />
          </div>
          <br />
          <Button className="interfaceButtons adminButtons" onClick={() => mintTokens(mintTargetAddress,mintAmount)}>Mint</Button>
        </div>
      )
    }
  }

  const burnerCheck = () => {
    if (minter === 'true') {
      return (
        <div>
          <h2>Burning</h2>
          <div className="inputBox">
            <p>(Optional) Burn From Address</p>
            <Input fluid onChange={(e) => setBurnTargetAddress(e.target.value)} />
          </div>
          <div className="inputBox">
            <p>Amount</p>
            <Input fluid onChange={(e) => setBurnAmount(e.target.value)} />
          </div>
          <br/>
          <Button className="interfaceButtons adminButtons" onClick={burnHandler}>Burn</Button>
        </div>
      )
    }
  }

  const calcValue = () => {
    setdilutedValue(supply * aurumPrice);
  }

  // Load everything 
  useEffect(() => {
    fetchSymbol();
    fetchTotalSupply();
    fetchPaused();
    checkAllowance();
    calcValue();
    
    if (userAddress) {
      fetchUserBalance();
      checkUserRole("minter");
      checkUserRole("pauser");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[userAddress, tokenAddress, supply, aurumPrice]);

  return (

    <div className="container">
      <h1>🏦 {symbol} Manager</h1>
      <div className="tokenInfoSection">
        {/* <div className="tokenInfoBox">
          <p className="bigNumber">{Number(supply).toLocaleString()}</p>
          <p className="bigNumberDescription">Total Supply</p>
        </div> */}
        <div className="tokenInfoBox">
          <p className="bigNumber">{Number(userBalance).toLocaleString()}</p>
          <p className="bigNumberDescription">Your Balance</p>
        </div>
        <div className="tokenInfoBox">
          <p className="bigNumber">${roundedNum(aurumPrice,4)}</p>
          <p className="bigNumberDescription">Current Price</p>
        </div>
        <div className="tokenInfoBox">
          <p className="bigNumber">${Number(aurumPrice * userBalance).toLocaleString()}</p>
          <p className="bigNumberDescription">Your Value</p>
        </div>
      </div>

      {pauserCheck()}

      <Grid columns='three' divided className="actionGrid">
        <Grid.Row>
          <Grid.Column>
            <h2>Transferring</h2>
            <div className="inputBox">
              <p>Address you want to send Aurum to</p>
              <Input fluid onChange={(e) => setTransferTargetAddress(e.target.value)} />
            </div>
            <div className="inputBox">
              <p>Amount</p>
              <Input fluid onChange={(e) => setTransferAmount(e.target.value)} />
            </div>
            <br/>
            <Button className="interfaceButtons adminButtons" onClick={() => transferHandler()}>Send</Button>
          </Grid.Column>
          <Grid.Column>
            {burnerCheck()}
          </Grid.Column>
          <Grid.Column>
            {minterCheck()}
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <br />
    </div>
  )
};

export default AurumAdmin;