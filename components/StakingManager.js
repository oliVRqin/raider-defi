import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import RaiderStaking from './artifacts/contracts/RaiderStaking.sol/RaiderStaking.json';
import RaiderGold from './artifacts/contracts/RaiderAurumToken.sol/RaiderAurumToken.json';
import RaiderToken from './artifacts/contracts/RaiderToken.sol/RaiderToken.json';
import { Input, Button, Grid } from 'semantic-ui-react';
import { maxAllowance } from '../helpers';

const StakingManager = ( {userAddress, stakingContractAddress, contractName, setProvider} ) => {
  const [rewardToken, setRewardToken] = useState();
  const [stakingToken, setStakingToken] = useState();
  const [dailyEmissions, setDailyEmissions] = useState();
  const [newEmissionsRate, setNewEmissionsRate] = useState();
  const [stakingTokenAllowance, setStakingTokenAllowance] = useState();
  const [stakedAmount, setStakedAmount] = useState();
  const [storedRewards, setStoredRewards] = useState();
  const [newRewardsToAdd, setNewRewardsToAdd] = useState();
  const [rewardTokenAllowance, setRewardTokenAllowance] = useState();
  const [userRewardsBalance, setUserRewardsBalance] = useState();
  const [totalStakedSupply, setTotalStakedSupply] = useState();
  const [userStakingTokens, setUserStakingTokens] = useState();
  const [paused, setPaused] = useState();
  const [pausedText, setPausedText] = useState();
  const [newOwner, setNewOwner] = useState();
  const [rewardsToWithdraw, setRewardsToWithdraw] = useState();

  const setStakingContract = (data) => {
    return new ethers.Contract(stakingContractAddress, RaiderStaking.abi, data);
  }

  const setStakingTokenContract = (data) => {
    return new ethers.Contract(stakingToken, RaiderGold.abi, data);
  }

  const setRewardTokenContract = (data) => {
    return new ethers.Contract(rewardToken, RaiderToken.abi, data);
  }

  // CONTRACT VIEWS

  // Get the address of the Reward token
  const fetchRewardToken = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const contract = setStakingContract(setProvider());
      try {
        const data = await contract.showRewardToken();
        setRewardToken(data);
      } catch (err) {
        console.log("error: ", err);
        // fetchRewardToken();
      }
    }
  }

  // Get the address of the Staking token
  const fetchStakingToken = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const contract = setStakingContract(setProvider());
      try {
        const data = await contract.showStakingToken();
        setStakingToken(data);
      } catch (err) {
        console.log("error: ", err);
        // fetchStakingToken();
      }
    }
  }

  // Check what the daily reward rate is
  const fetchDailyEmissions = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const contract = setStakingContract(setProvider());
      try {
        const data = await contract.dailyEmissionsRate();
        setDailyEmissions(ethers.utils.formatEther(data));
      } catch (err) {
        console.log("error: ", err);
        // fetchDailyEmissions();
      }
    }
  }

  // Check the total stored rewards
  const fetchStoredRewards = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const contract = setStakingContract(setProvider());
      try {
        const data = await contract.rewardsBalance();
        setStoredRewards(ethers.utils.formatEther(data));
      } catch (err) {
        // console.log("error: ", err);
        fetchStoredRewards();
      }
    }
  }

  // check the logged in user's staking balance
  const fetchStake = async () => {
    if (!userAddress) return; 
    if (typeof window.ethereum !== 'undefined') {
      const contract = setStakingContract(setProvider());
      try {
        const data = await contract.addressStakedBalance(userAddress);
        setStakedAmount(ethers.utils.formatEther(data));
      } catch (err) {
        console.log("fetchStake err: ", err);
        // fetchStake();
      }
    }
  }

  const fetchTotalStakedSupply = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const contract = setStakingContract(setProvider());
      try {
        const data = await contract.totalStakedSupply();
        setTotalStakedSupply(ethers.utils.formatEther(data));
      } catch (err) {
        console.log("error fetchTotalStakedSupply: ", err);
        // fetchTotalStakedSupply();
      }
    }
  }

  const fetchPaused = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const contract = setStakingContract(setProvider());
      try {
        const data = await contract.paused();
        if (data.toString() === 'true') {
          setPausedText('Unpause');
        } else if (data.toString() === 'false') {
          setPausedText('Pause');
        }
        setPaused(data.toString());
      } catch (err) {
        // console.log("error: ", err);
        fetchPaused();
      }
    }
  }

  // CONTRACT ACTIONS 

  const updateEmissionsRate = async () => {
    if (!userAddress) return;
    if (typeof window.ethereum !== 'undefined') {
      const provider = setProvider();
      const signer = provider.getSigner();
      const contract = setStakingContract(signer);
      const transaction = await contract.setDailyEmissions(ethers.utils.parseEther(newEmissionsRate));
      await transaction.wait();
    }
  }

  const addRewards = async () => {
    if (!userAddress) return;
    if (typeof window.ethereum !== 'undefined') {
      const provider = setProvider();
      const signer = provider.getSigner();
      const contract = setStakingContract(signer);
      const transaction = await contract.depositRewards(ethers.utils.parseEther(newRewardsToAdd));
      await transaction.wait();
      fetchStoredRewards();
      checkRewardsAllowance();
    }
  }

  const withdrawRewards = async () => {
    if (!userAddress) return;
    if (typeof window.ethereum !== 'undefined') {
      const provider = setProvider();
      const signer = provider.getSigner();
      const contract = setStakingContract(signer);
      const transaction = await contract.withdrawRewards(ethers.utils.parseEther(rewardsToWithdraw));
      await transaction.wait();
      fetchStoredRewards();
    }
  }

  const updateRewards = async () => {
    if (!userAddress) return;
    if (typeof window.ethereum !== 'undefined') {
      const provider = setProvider();
      const signer = provider.getSigner();
      const contract = setStakingContract(signer);
      const transaction = await contract.updateBigRewardsPerToken();
      await transaction.wait();
    }
  }

  const pauseToggle = async () => {
    if (!userAddress) return;
    if (typeof window.ethereum !== 'undefined') {
      const provider = setProvider();
      const signer = provider.getSigner();
      const contract = setStakingContract(signer);
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

  const newOwnerHandler = async () => {
    if (!userAddress) return;
    if (typeof window.ethereum !== 'undefined') {
      const provider = setProvider();
      const signer = provider.getSigner();
      const contract = setStakingContract(signer);
      const transaction = await contract.transferOwnership(newOwner);
      await transaction.wait();
    }
  }

  // STAKING AND REWARD CONTRACT VIEWS 

  const checkStakingAllowance = async () => {
    if (!userAddress) return; 
    if (typeof window.ethereum !== 'undefined') {
      const contract = setStakingTokenContract(setProvider());
      try {
        const data = await contract.allowance(userAddress, stakingContractAddress);
        setStakingTokenAllowance(ethers.utils.formatEther(data));
      } catch (err) {
        console.log(err);
      }
    }
  }

  const checkRewardsAllowance = async () => {
    if (!userAddress) return; 
    if (typeof window.ethereum !== 'undefined') {
      const contract = setRewardTokenContract(setProvider());
      try {
        const data = await contract.allowance(userAddress, stakingContractAddress);
        setRewardTokenAllowance(ethers.utils.formatEther(data));
      } catch (err) {
        console.log(err);
      }
    }
  }

  const checkStakingTokenBalance = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const contract = setStakingTokenContract(setProvider());
      try {
        const data = await contract.balanceOf(userAddress);
        setUserStakingTokens(ethers.utils.formatEther(data));
      } catch (err) {
        console.log("error: ", err);
      }
    }
  }

  // STAKING AND REWARD CONTRACT ACTIONS

  const addRewardsAllowance = async () => {
    if (!userAddress) return;
    if (typeof window.ethereum !== 'undefined') {
      const provider = setProvider();
      const signer = provider.getSigner();
      const contract = setRewardTokenContract(signer);
      // TK same number for now, maybe infinite later
      const transaction = await contract.approve(stakingContractAddress,maxAllowance);
      await transaction.wait();
      checkRewardsAllowance();
    }
  }

  // HANDLERS

  const rewardsHandler = () => {
    checkRewardsAllowance();
    if (rewardTokenAllowance - newRewardsToAdd < 0) {
      addRewardsAllowance();
    } else if (rewardTokenAllowance - newRewardsToAdd >= 0) {
      addRewards();
    }
  }

  // LOAD ALL THE THINGS
  useEffect(() => {
    if (stakingContractAddress) {
      fetchDailyEmissions();
      if (stakingToken && rewardToken) {
        checkStakingAllowance();
        checkRewardsAllowance();
        fetchStake();
        fetchTotalStakedSupply();
        if (userAddress) {
          checkStakingTokenBalance();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[userAddress, stakingToken, rewardToken]);

  useEffect(() => {
    setProvider();
    if (stakingContractAddress) {
      fetchStakingToken();
      fetchRewardToken();
      fetchStoredRewards(); 
      fetchPaused();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[userAddress]);

  return (
    <div className="App">

      <div className="container">
        <h2>Staking Admin for {contractName}</h2>
        <Grid columns='three'>
          <Grid.Row>
            <Grid.Column>
              <h2>Activity</h2>
              <h3>Contract Info</h3>
              <p>This is for staking token address {stakingToken}</p>
              <p>There are currently {Math.floor(totalStakedSupply)} tokens staked in the contract!</p>
              <div className="inputBox">
                <p>You can manually update rewards here</p>
                <Button className="adminButtons interfaceButtons" onClick={() => updateRewards()}>UPDATE</Button>
              </div>
              <h3>Rewards Emissions</h3>

              <p>The daily rewards emissions rate is {dailyEmissions} RAIDER Tokens</p>
              <div className="inputBox">
                <Input className="adminInput" fluid onChange={(e) => setNewEmissionsRate(e.target.value)} />
                <Button className="adminButtons interfaceButtons" onClick={() => updateEmissionsRate()}>UPDATE</Button>
              </div>

              
            </Grid.Column>
            <Grid.Column>
              <h2>Rewards</h2>

              <h3>Add Rewards</h3>
              <p>There are {Math.floor((storedRewards) * 100)/100} reward tokens, which will run out in {Math.floor((storedRewards / dailyEmissions) * 100)/100} days</p>
              <div className="inputBox">
                <Input className="adminInput" fluid onChange={(e) => setNewRewardsToAdd(e.target.value)} />
                <Button className="adminButtons interfaceButtons" onClick={() => rewardsHandler()}>DEPOSIT</Button>
              </div>

              <br />

              <h3>Remove Rewards</h3>
              <p>There are {Math.floor((storedRewards) * 100)/100} reward tokens, which will run out in {Math.floor((storedRewards / dailyEmissions) * 100)/100} days</p>
              <div className="inputBox">
                <Input className="adminInput" fluid onChange={(e) => setRewardsToWithdraw(e.target.value)} />
                <Button className="adminButtons interfaceButtons" onClick={() => withdrawRewards()}>WITHDRAW</Button>
              </div>
            </Grid.Column>
            <Grid.Column>
              <h2>Danger Zone</h2>
              <h3>Transfer Ownership</h3>
              <div className="inputBox">
                <p>The address you want to make owner:</p>
                <Input className="adminInput" fluid onChange={(e) => setNewOwner(e.target.value)} />
                <Button className="adminButtons interfaceButtons" onClick={() => newOwnerHandler()}>UPDATE</Button>
              </div>
              
              <h3>Pausing</h3>
              <Button color="red" onClick={pauseToggle}>{pausedText} Contract</Button>

            </Grid.Column>
          </Grid.Row>
        </Grid>

      </div>

    </div>
  )
};

export default StakingManager;
