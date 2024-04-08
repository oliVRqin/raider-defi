import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { roundedNum } from "../../helpers";

const ClaimRewards = ({pool, getRewards, userRewardsBalance, error, reward}) => {
  return (
    <div className="stakingSubBox">
      
      <Grid columns='equal'>
        <Grid.Column width={8}>
          <p>You have {roundedNum(userRewardsBalance, 4)} ${reward} tokens to claim!</p>
          <p>{error}</p>
          <div className="stakingInputAndButton">
            <Button className="interfaceButtons claimButton" onClick={() => getRewards()}>Claim</Button>
          </div>
        </Grid.Column>
        <Grid.Column width={4}>

        </Grid.Column>
      </Grid>
    </div>
  )
}

export default ClaimRewards;