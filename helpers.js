import { ethers } from 'ethers';

export const roundedNum = (num, digits) => {
  const multiplier = 10 ** digits;
  return Math.floor(num * multiplier) / multiplier;
}

export const maxAllowance = ethers.utils.parseEther('10000000000');