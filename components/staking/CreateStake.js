import React, { useEffect } from "react";
import { Grid, Button, Input } from "semantic-ui-react";
import { roundedNum } from "../../helpers";

const CreateStake = ({setStakeAmount, stakingHandler, pool, userStakingTokens, hasAllowance, error, stakingLink, stakedAmount}) => {

  const stakingTextHandler = () => {
    if (!hasAllowance) {
      return "Add Allowance"
    } else if (hasAllowance && stakedAmount == 0) {
      return "Stake"
    } else if (hasAllowance && stakedAmount > 0) {
      return "Stake & Get Rewards"
    }
  }

  useEffect(() => {
    setStakeAmount(userStakingTokens)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return (
    <div className="stakingSubBox">
      <Grid columns='equal'>
        <Grid.Column width={12}>
          <p>Stake {pool} LP tokens from Sushi to earn $RAIDER. <a target="_blank" href={stakingLink} rel="noreferrer">Go here to make LP tokens</a>. You have {roundedNum(userStakingTokens, 4)} to stake.</p>
          <p className="errorMessage">{error}</p>
          <div className="stakingInputAndButton">
            <Input className="stakingInput" defaultValue={userStakingTokens} onChange={(e) => setStakeAmount(e.target.value)}/>
            <Button className="stakingButton interfaceButtons" onClick={() => stakingHandler()}>{stakingTextHandler()}</Button>
          </div>
        </Grid.Column>
        <Grid.Column width={4}>

        </Grid.Column>
      </Grid>
      
      
    </div>
  )
}

export default CreateStake;