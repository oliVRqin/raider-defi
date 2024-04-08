import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import RaiderToken from './artifacts/contracts/RaiderToken.sol/RaiderToken.json';
import { Input, Button, Grid } from 'semantic-ui-react';

const RaiderManager = ({ userAddress, setProvider, raiderPrice }) => {
  const [supply, setSupply] = useState("");
  const [symbol, setSymbol] = useState("");
  const [userBalance, setUserBalance] = useState();
  const [transferTargetAddress, setTransferTargetAddress] = useState();
  const [transferAmount, setTransferAmount] = useState();
  const [dilutedValue, setDilutedValue] = useState();

  const tokenAddress = process.env.NEXT_PUBLIC_RAIDER;

  const setContract = (data) => {
    return new ethers.Contract(tokenAddress, RaiderToken.abi, data);
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

  const calcValue = () => {
    setDilutedValue(raiderPrice * 100000000);
  }

  // Update the total supply and the current user's balance
  const updateBalances = () => {
    fetchTotalSupply();
    if (userAddress) {
      fetchUserBalance();
    }
  }

  // Load everything 
  useEffect(() => {
    setProvider();
    if (tokenAddress){ 
      fetchSymbol();
      updateBalances();
      calcValue();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[userAddress, tokenAddress, supply, raiderPrice]);

  return (
    <div className="App">

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
          <p className="bigNumber">${Number(raiderPrice).toLocaleString()}</p>
          <p className="bigNumberDescription">Current Price</p>
        </div>
        <div className="tokenInfoBox">
          <p className="bigNumber">${Number(userBalance * raiderPrice).toLocaleString()}</p>
          <p className="bigNumberDescription">Your Value</p>
        </div>
      </div>

        <Grid columns='three' divided className="actionGrid">
          <Grid.Row>
            <Grid.Column>
              <h2>Transferring</h2>
              <div className="inputBox">
                <p>Address you want to send RAIDER to</p>
                <Input fluid onChange={(e) => setTransferTargetAddress(e.target.value)} />
              </div>
              <div className="inputBox">
                <p>Amount</p>
                <Input fluid onChange={(e) => setTransferAmount(e.target.value)} />
              </div>
              <br/>
              <Button className="interfaceButtons adminButtons" onClick={() => transfer(transferTargetAddress, transferAmount)}>Send</Button>
            </Grid.Column>
            <Grid.Column>

            </Grid.Column>
            <Grid.Column>
              
            </Grid.Column>
          </Grid.Row>
        </Grid>

      </div>

    </div>
  )
};

export default RaiderManager;