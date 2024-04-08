import StakingManager from '../components/StakingManager';
import Head from 'next/head';
import { Menu, Button } from 'semantic-ui-react';
import { useState } from 'react';
import {ethers} from 'ethers';
import Link from 'next/link';

export default function Admin() {
  const [userAddress, setUserAddress] = useState("");
  const [connected, setConnected] = useState("Connect Wallet");
  const [shortAddress, setShortAddress] = useState();

  // request access to the user's MetaMask account
  const requestAccount = async () => {
    const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setConnected("Connected");
    setUserAddress(account[0]);
    setShortAddress("0x..." + account[0].slice(account[0].length - 5));
  }

  const setProvider = () => {
    try { 
      return new ethers.providers.Web3Provider(window.ethereum);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <Head>
        <link href="https://cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" rel="stylesheet" />
      </Head>
      <Menu>
        <Menu.Item><Link href="/">Back to staking</Link></Menu.Item>
        <Menu.Item position="right">
          <p className="address">{shortAddress}</p>
        </Menu.Item>
        <Menu.Item>
          <Button onClick={requestAccount}>{connected}</Button>
        </Menu.Item>
      </Menu>
      <div className="container mainBody">
        <StakingManager setProvider={setProvider} stakingContractAddress={process.env.NEXT_PUBLIC_STAKING_RAIDERMATIC} userAddress={userAddress} contractName={'RAIDER/MATIC'}/>
        <br />
        <StakingManager setProvider={setProvider} stakingContractAddress={process.env.NEXT_PUBLIC_STAKING_AURUMMATIC} userAddress={userAddress} contractName={'AURUM/MATIC'}/>
        <br />
        <StakingManager setProvider={setProvider} stakingContractAddress={process.env.NEXT_PUBLIC_STAKING_AURUMUSDC} userAddress={userAddress} contractName={'AURUM/USDC'}/>
      </div>
    </div>
  )
}
