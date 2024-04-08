import React, {useEffect} from "react";
import { Grid, Button, Input, Dropdown } from "semantic-ui-react";
import { roundedNum } from "../../helpers";

const CreateStake = ({setStakeAmount, stakingHandler, pool, userStakingTokens, hasAllowance, setLockDuration, error, stakedAmount}) => {

  const lockingOptions = [
    {
      key: '0',
      text: 'Same Duration',
      value: 0
    },
    {
      key: '3',
      text: '3 Months for 1x',
      value: 3
    },
    {
      key: '6',
      text: '6 Months for 2x',
      value: 6
    },
    {
      key: '9',
      text: '9 Months for 3x',
      value: 9
    },
    {
      key: '12',
      text: '12 Months for 4x',
      value: 12
    }
  ]

  const stakingTextHandler = () => {
    if (!hasAllowance) {
      return "Add Allowance"
    } else if (hasAllowance && stakedAmount == 0) {
      return "Stake"
    } else if (hasAllowance && stakedAmount > 0) {
      return "Stake & Get Rewards"
    }
  }

  // Removed for UX
  // const startingValue = () => {
  //   if (stakedAmount == 0) {
  //     setLockDuration(12);
  //     return 12;
  //   } else if (stakedAmount > 0) {
  //     return 0;
  //   }
  // }

  useEffect(() => {
    setStakeAmount(userStakingTokens)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return (
    <div className="stakingSubBox">
      <Grid columns='equal'>
        <Grid.Column width={14}>
        <p>Stake $RAIDER to earn $AURUM. Staking for longer earns you a multiple on your rewards. You have {roundedNum(userStakingTokens, 4)} to stake.</p>
        <p>Adding to an existing stake will change the lock time and multiplier for ALL locked tokens. You can only stake for an equal or greater amount of time.</p>
        <p className="errorMessage">{error}</p>
          <div className="stakingInputAndButton">
            <Input className="stakingInput" defaultValue={userStakingTokens} onChange={(e) => setStakeAmount(e.target.value)}/>
            <Dropdown
                // placeholder='Select Duration'
                defaultValue={0}
                className='lockingDropdown'
                fluid
                selection
                options={lockingOptions}
                onChange={(e, data) => setLockDuration(data.value)}
              />
            <Button className="stakingButton interfaceButtons" onClick={() => stakingHandler()}>{stakingTextHandler()}</Button>
          </div>
        </Grid.Column>
        <Grid.Column width={2}>

        </Grid.Column>
      </Grid>
      
      
    </div>
  )
}

export default CreateStake;