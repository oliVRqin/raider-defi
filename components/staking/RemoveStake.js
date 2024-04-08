import React, {useEffect} from "react";
import { Grid, Button, Input } from "semantic-ui-react";

const RemoveStake = ({pool, setUnstakeAmount, removeStake, lockTimeRemaining, error, stakedAmount}) => {
  
  useEffect(() => {
    setUnstakeAmount(stakedAmount)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  
  return (
    <div className="stakingSubBox">
      
      <Grid columns='equal'>
        <Grid.Column width={8}>
          <p>Unstake your {pool} tokens. {lockTimeRemaining && `Heads up that you have ${lockTimeRemaining} days till your tokens unlock!`}</p>
          <p className="errorMessage">{error}</p>
          <div className="stakingInputAndButton">
            <Input className="stakingInput" defaultValue={stakedAmount} onChange={(e) => setUnstakeAmount(e.target.value)}/>
            <Button className="stakingButton interfaceButtons" onClick={() => removeStake()}>Unstake & Get Rewards</Button>
          </div>
        </Grid.Column>
        <Grid.Column width={4}>

        </Grid.Column>
      </Grid>
    </div>
  )
}

export default RemoveStake;