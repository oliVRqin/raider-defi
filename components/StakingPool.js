import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import RaiderStaking from './artifacts/contracts/RaiderStaking.sol/RaiderStaking.json';
import RaiderGold from './artifacts/contracts/RaiderAurumToken.sol/RaiderAurumToken.json';
import RaiderToken from './artifacts/contracts/RaiderToken.sol/RaiderToken.json';
import { Grid, Menu } from 'semantic-ui-react';
import CreateStake from './staking/CreateStake';
import RemoveStake from './staking/RemoveStake';
import ClaimRewards from './staking/ClaimRewards';
import { maxAllowance, roundedNum } from '../helpers';
import Image from 'next/image';

const StakingPool = ({ pool, userAddress, stakingContractAddress, setProvider, lpTokenPrice, raiderPrice, stakingLink }) => {
  const [APR, setAPR] = useState('');
  const [TVL, setTVL] = useState('');
  const [opened, setOpened] = useState(false);
  const [activeTab, setActiveTab] = useState('staking');

  const [rewardToken, setRewardToken] = useState('');
  const [stakingToken, setStakingToken] = useState('');
  const [dailyEmissions, setDailyEmissions] = useState('');
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [stakingTokenAllowance, setStakingTokenAllowance] = useState('');
  const [stakedAmount, setStakedAmount] = useState('');
  const [userRewardsBalance, setUserRewardsBalance] = useState('');
  const [totalStakedSupply, setTotalStakedSupply] = useState('');
  const [userStakingTokens, setUserStakingTokens] = useState('');
  const [hasAllowance, setHasAllowance] = useState('');
  const [error, setError] = useState('');

  /* const setStakingContract = (data) => {
    console.log("RaiderStaking.abi: ", RaiderStaking.abi)
    console.log("stakingContractAddress: ", stakingContractAddress)
    console.log("data from setStakingContract: ", data)
    return new ethers.Contract(stakingContractAddress, RaiderStaking.abi, data);
  } */
  const setStakingContract = () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      console.log("stakingContractAddress: ", stakingContractAddress)
      return new ethers.Contract(stakingContractAddress, RaiderStaking.abi, signer);
    }
    return null;
  }

  const setStakingTokenContract = (data) => {
    return new ethers.Contract(stakingToken, RaiderGold.abi, data);
  }

  const setRewardTokenContract = (data) => {
    return new ethers.Contract(rewardToken, RaiderToken.abi, data);
  }

  const checkNetwork = async () => {
    const provider = setProvider();
    // Make sure provider is defined before trying to call getNetwork on it
    if (provider) {
      const network = await provider.getNetwork();
      console.log(network); // Check the output to confirm the network
  
      if (network.chainId !== 137) {
        console.error('Connected to the wrong network');
      }
    }
  };
  
  // Call checkNetwork inside a useEffect hook to ensure it's client-side
  useEffect(() => {
    checkNetwork();
  }, []);

  // CONTRACT VIEWS

  // Get the address of the Reward token
  const fetchRewardToken = async () => {
    const contract = setStakingContract();
    if (contract) {
      console.log("fetchRewardToken contract:", contract);
      try {
        const data = await contract.showRewardToken();
        setRewardToken(data);
      } catch (err) {
        console.error("Error fetching reward token:", err);
        console.error("Error details:", err.message);
        console.error("Error code:", err.code);
        console.error("Error data:", err.data);
      }
    }
  };

  // Get the address of the Staking token
  const fetchStakingToken = async () => {
  const contract = setStakingContract();
  if (contract) {
    console.log("fetchStakingToken contract: ", contract)
    try {
      const data = await contract.showStakingToken();
      setStakingToken(data);
    } catch (err) {
      console.log("Error details:", err);
      console.log("Error message:", err.message);
      console.log("Error code:", err.code);
      console.log("Error data:", err.data);
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
        console.log("error fetchDailyEmissions: ", err);
        // fetchDailyEmissions();
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
        console.log("data fetchStake: ", data)
        setStakedAmount(ethers.utils.formatEther(data));
      } catch (err) {
        console.log("error fetchStake: ", err);
        // fetchStake();
      }
    }
  }

  // Check the logged in user's rewards balance
  const fetchUserRewards = async () => {
    if (!userAddress) return; 
    if (typeof window.ethereum !== 'undefined') {
      const contract = setStakingContract(setProvider());
      try {
        const data = await contract.userPendingRewards(userAddress);
        console.log("fetchUserRewards data: ", data)
        setUserRewardsBalance(ethers.utils.formatEther(data));
      } catch (err) {
        console.log("error fetchUserRewards: ", err);
        // fetchUserRewards();
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
        // console.log("error: ", err);
        // fetchTotalStakedSupply();
      }
    }
  }

  // CONTRACT ACTIONS 

  const createStake = async () => {
    if (!userAddress) return;
    if (typeof window.ethereum !== 'undefined') {
      const provider = setProvider();
      const signer = provider.getSigner();
      const contract = setStakingContract(signer);
      try {

        const tx = await contract.createStake(ethers.utils.parseEther(stakeAmount));
        await tx.wait();

      } catch (error) {
        if (error.data) {
          setError(error.data.message.toString());
        }
      }
      fetchStake();
      checkStakingAllowance();
    }
  }

  const removeStake = async () => {
    if (!userAddress) return;
    if (typeof window.ethereum !== 'undefined') {
      const provider = setProvider();
      const signer = provider.getSigner();
      const contract = setStakingContract(signer);
      try {
        const transaction = await contract.removeStake(ethers.utils.parseEther(unstakeAmount));
        await transaction.wait();
      } catch (error) {
        if (error.data) {
          setError(error.data.message.toString());
        }
      }
      
      fetchStake();
    }
  }

  const getRewards = async () => {
    if (!userAddress) return;
    if (typeof window.ethereum !== 'undefined') {
      const provider = setProvider();
      const signer = provider.getSigner();
      const contract = setStakingContract(signer);
      try {
        const transaction = await contract.getRewards();
        await transaction.wait();
      } catch (error) {
        if (error.data) {
          setError(error.data.message.toString());
        }
      }
      
      fetchUserRewards();
    }
  }

  // STAKING AND REWARD CONTRACT VIEWS 

  const checkStakingAllowance = async () => {
    if (!userAddress) return; 
    if (typeof window.ethereum !== 'undefined') {
      const contract = setStakingTokenContract(setProvider());
      try {
        const data = await contract.allowance(userAddress, stakingContractAddress);
        const allowance = ethers.utils.formatEther(data)
        setStakingTokenAllowance(allowance);
      } catch (err) {
        // console.log(err);
        checkStakingAllowance();
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
        // console.log("error: ", err);
        checkStakingTokenBalance();
      }
    }
  }

  // STAKING AND REWARD CONTRACT ACTIONS

  const addStakingAllowance = async () => {
    if (!userAddress) return;
    if (typeof window.ethereum !== 'undefined') {
      const provider = setProvider();
      const signer = provider.getSigner();
      const contract = setStakingTokenContract(signer);
      try {
        const transaction = await contract.approve(stakingContractAddress,maxAllowance);
        await transaction.wait();
      } catch (error) {
        if (error.data) {
          setError(error.data.message.toString());
        }
      }
      checkStakingAllowance();
    }
  }

  // HANDLERS

  const stakingHandler = async () => {
    if (!userAddress) {
      return;
    };
    if (stakingTokenAllowance - stakeAmount < 0) {
      addStakingAllowance();
    } else if (stakingTokenAllowance - stakeAmount >= 0) {
      createStake();
    }
  }

  const allowanceTextHandler = async () => {
    if (stakingTokenAllowance - stakeAmount >= 0) {
      setHasAllowance(true);
    } else if (stakingTokenAllowance - stakeAmount < 0) {
      setHasAllowance(false);
    }
  }

  const calcTVL = () => {
    setTVL(lpTokenPrice * totalStakedSupply);
  }

  const calcAPR = () => {
    const annualEmissions = dailyEmissions * 365;
    const annualEmissionsValue = annualEmissions * raiderPrice;
    const supplyValue = totalStakedSupply * lpTokenPrice;
    setAPR((annualEmissionsValue / supplyValue) * 100); 
  }

  useEffect(() => {
    allowanceTextHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stakingTokenAllowance, stakeAmount]);

  // LOAD ALL THE THINGS
  useEffect(() => {
    if (stakingContractAddress) {
      console.log("load??")
      fetchDailyEmissions();
      console.log("load stakingToken: ", stakingToken)
      console.log("load rewardToken: ", rewardToken)
      if (stakingToken && rewardToken) {
        console.log("load again??")
        checkStakingAllowance();
        fetchStake();
        fetchUserRewards();
        fetchTotalStakedSupply();
        calcTVL();
        calcAPR();
        if (userAddress) {
          checkStakingTokenBalance();
        }
      }
    }
  },[userAddress, stakingToken, rewardToken, stakeAmount, lpTokenPrice, raiderPrice, stakingContractAddress, totalStakedSupply]);

  useEffect(() => {
    if (stakingContractAddress) {
      console.log("here!!!!")
      fetchStakingToken();
      fetchRewardToken();
    }
  },[stakingContractAddress, userAddress]);

  const toggleOpened = () => {
    setOpened(!opened);
  }

  const setActive = (e, name) => {
    setError('');
    setActiveTab(name);
  }

  const Info = () => {
    return (
      <div className="stakingSubBox">
        <p>LP token address: <a target="_blank" href={`https://polygonscan.com/address/${stakingContractAddress}`} rel="noreferrer">{stakingContractAddress}</a></p>
        <p>Current daily emissions: {dailyEmissions} RAIDER tokens.</p>
      </div>
    )
  }

  const stakingPanel = () => {
    if (opened) {
      return (
        <Menu pointing secondary>
          <Menu.Item 
            name='staking'
            active={activeTab === 'staking'}
            onClick={(e, {name}) => setActive(e, name)}
          >
            Stake
          </Menu.Item>
          <Menu.Item 
            name='claiming'
            active={activeTab === 'claiming'}
            onClick={(e, {name}) => setActive(e, name)}
          >
            Claim
          </Menu.Item>
          <Menu.Item 
            name='unstaking'
            active={activeTab === 'unstaking'}
            onClick={(e, {name}) => setActive(e, name)}
          >
            Unstake
          </Menu.Item>
          <Menu.Item name='info'
            active={activeTab === 'info'}
            onClick={(e, {name}) => setActive(e, name)}
          >
            More Info
          </Menu.Item>
        </Menu>
      )
    }
  }

  const infoPanel = () => {
    if (opened) {
      if (activeTab === 'staking') {
        return (
          <CreateStake 
            setStakeAmount={setStakeAmount} 
            stakingHandler={stakingHandler} 
            pool={pool}
            userStakingTokens={userStakingTokens}
            hasAllowance={hasAllowance}
            stakedAmount={stakedAmount}
            error={error}
            stakingLink={stakingLink}
          />
        ) 
      } else if (activeTab === 'claiming') {
        return (
          <ClaimRewards 
            getRewards={getRewards}
            userRewardsBalance={userRewardsBalance}
            pool={pool}
            error={error}
            reward='RAIDER'
          />
        ) 
      } else if (activeTab === 'unstaking') {
        return (
          <RemoveStake 
            setUnstakeAmount={setUnstakeAmount}
            removeStake={removeStake}
            pool={pool}
            error={error}
            stakedAmount={stakedAmount}
          />
        ) 
      } else if (activeTab === 'info') {
        return (
          <Info />
        )
      }
    }
  }

  return (
    <div className="stakingPool stakingBox">
      <Grid columns='equal' divided className="stakingGrid">
        <Grid.Row className="stakingPoolBody" onClick={toggleOpened}>
          <Grid.Column width={2} >
            <p className="stakingPoolBodyToken"><b>{pool}</b></p>
          </Grid.Column>
          <Grid.Column>
            <p className="stakingPoolBodyInfo">{Number(roundedNum(userRewardsBalance, 2)).toLocaleString()} RAIDER</p>
          </Grid.Column>
          <Grid.Column>
            <p className="stakingPoolBodyInfo">{Number(roundedNum(APR, 2)).toLocaleString()}%</p>
          </Grid.Column>
          <Grid.Column>
            <p className="stakingPoolBodyInfo">{Number(roundedNum(stakedAmount, 5)).toLocaleString()} LP Tokens</p>
          </Grid.Column>
          <Grid.Column>
            <p className="stakingPoolBodyInfo">${Number(roundedNum(stakedAmount * lpTokenPrice, 2)).toLocaleString()}</p>
          </Grid.Column>
          <Grid.Column>
            <p className="stakingPoolBodyInfo">${Number(roundedNum(TVL,2)).toLocaleString()}</p>
          </Grid.Column>
          <Grid.Column width={1}><Image alt='down arrow' src='/down_arrow.svg' width='18' height='18'/></Grid.Column>
        </Grid.Row>
      </Grid>

      {stakingPanel()}

      {infoPanel()}

    </div>
  )
}

export default StakingPool;
