import { Grid } from 'semantic-ui-react';
import StakingPool from './StakingPool';

const Staking = ({ userAddress, setProvider, aurumMaticPrice, raiderMaticPrice, aurumPrice, raiderPrice, aurumUsdcPrice, raiderEthPrice }) => {
  return (
    <div>
        <div className="lpStakingBox">
          <h3>Provide Liquidity on SushiSwap to Earn $RAIDER</h3>
          <div className="stakingBoxHeader">
            <Grid columns='equal' divided className="stakingGrid">
              <Grid.Row className="stakingHeaderRow">
                <Grid.Column width={2} ><p className="stakingPoolColumnTitle">Pool</p></Grid.Column>
                <Grid.Column><p className="stakingPoolColumnTitle">Earned</p></Grid.Column>
                <Grid.Column><p className="stakingPoolColumnTitle">APR</p></Grid.Column>
                <Grid.Column><p className="stakingPoolColumnTitle">Your Tokens</p></Grid.Column>
                <Grid.Column><p className="stakingPoolColumnTitle">Your Balance</p></Grid.Column>
                <Grid.Column><p className="stakingPoolColumnTitle">TVL</p></Grid.Column>
                <Grid.Column width={1}><p className="stakingPoolColumnTitle">More</p></Grid.Column>
              </Grid.Row>
            </Grid>

            <StakingPool 
              setProvider={setProvider} 
              stakingContractAddress={process.env.NEXT_PUBLIC_STAKING_RAIDERMATIC} 
              userAddress={userAddress} 
              pool="RAIDER/MATIC" 
              lpTokenPrice={raiderMaticPrice} 
              raiderPrice={raiderPrice} 
              stakingLink={"https://app.sushi.com/add/ETH/0xcd7361ac3307D1C5a46b63086a90742Ff44c63B3"}
            />
            <StakingPool 
              setProvider={setProvider} 
              stakingContractAddress={process.env.NEXT_PUBLIC_STAKING_RAIDERETH} 
              userAddress={userAddress} 
              pool="RAIDER/WETH" 
              lpTokenPrice={raiderEthPrice} 
              raiderPrice={raiderPrice} 
              stakingLink={"https://app.sushi.com/add/0xcd7361ac3307D1C5a46b63086a90742Ff44c63B3/0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"}
            />
            <StakingPool 
              setProvider={setProvider} 
              stakingContractAddress={process.env.NEXT_PUBLIC_STAKING_AURUMMATIC} 
              userAddress={userAddress} 
              pool="AURUM/MATIC" 
              lpTokenPrice={aurumMaticPrice} 
              raiderPrice={raiderPrice} 
              stakingLink={"https://app.sushi.com/add/ETH/0x34d4ab47Bee066F361fA52d792e69AC7bD05ee23"}
            />
            <StakingPool 
              setProvider={setProvider} 
              stakingContractAddress={process.env.NEXT_PUBLIC_STAKING_AURUMUSDC} 
              userAddress={userAddress} 
              pool="AURUM/USDC" 
              lpTokenPrice={aurumUsdcPrice} 
              raiderPrice={raiderPrice} 
              stakingLink={"https://app.sushi.com/add/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174/0x34d4ab47Bee066F361fA52d792e69AC7bD05ee23"}
            />
          </div>    
        </div>
    </div>
  )
}

export default Staking;
