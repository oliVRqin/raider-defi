import Head from 'next/head'
import { useEffect, useState } from 'react';
import { Button, Menu } from 'semantic-ui-react';
import Staking from '../components/Staking';
import RaiderAurumToken from '../components/artifacts/contracts/RaiderAurumToken.sol/RaiderAurumToken.json';
import RaiderToken from '../components/artifacts/contracts/RaiderToken.sol/RaiderToken.json';
import { ethers } from 'ethers';
import axios from 'axios';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';


export default function Home({ raiderPrice, aurumPrice, aurumMaticPrice, raiderMaticPrice, aurumUsdcPrice, raiderEthPrice }) {
  const [userAddress, setUserAddress] = useState("");
  const [connected, setConnected] = useState("Connect Wallet");
  const [manager, setManager] = useState('staking');
  const [shortAddress, setShortAddress] = useState();


  const [aurumSupply, setAurumSupply] = useState("");
  const [raiderSupply, setRaiderSupply] = useState("");

  // $RAIDER user balance
  const [raiderBalance, setRaiderBalance] = useState();

  // $AURUM user balance
  const [aurumBalance, setAurumBalance] = useState();

  // $AURUM Token Address
  const aurumTokenAddress = process.env.NEXT_PUBLIC_AURUM;

  // $RAIDER Token Address
  const raiderTokenAddress = process.env.NEXT_PUBLIC_RAIDER;

  // Load everything 
  useEffect(() => {
    fetchAurumTotalSupply();
    fetchRaiderTotalSupply();
    if (userAddress) {
      fetchAurumUserBalance();
      fetchRaiderUserBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAddress, aurumTokenAddress, raiderTokenAddress, aurumSupply, raiderSupply, aurumPrice, raiderPrice]);


  // Sets $AURUM contract
  const setAurumContract = (data) => {
    return new ethers.Contract(aurumTokenAddress, RaiderAurumToken.abi, data);
  }

  // call the smart contract, read the current $AURUM supply
  const fetchAurumTotalSupply = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const contract = setAurumContract(setProvider());
      try {
        const data = await contract.totalSupply();
        setAurumSupply((ethers.utils.formatEther(data)));
      } catch (err) {
        console.log("error: ", err);
      }
    }
  }

  // Get the $AURUM balance for an address
  const fetchAurumBalance = async (address) => {
    if (typeof window.ethereum !== 'undefined') {
      const contract = setAurumContract(setProvider());
      try {
        const data = await contract.balanceOf(address);
        return(ethers.utils.formatEther(data));
      } catch (err) {
        console.log("error: ", err);
      }
    }
  }

  // Get the current user's $AURUM balance
  const fetchAurumUserBalance = async () => {
    if (!userAddress) return;
    const balance = await fetchAurumBalance(userAddress);
    setAurumBalance(balance);
  }

  // Sets $RAIDER contract
  const setRaiderContract = (data) => {
    return new ethers.Contract(raiderTokenAddress, RaiderToken.abi, data);
  }

  // call the smart contract, read the current $RAIDER supply
  const fetchRaiderTotalSupply = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const contract = setRaiderContract(setProvider());
      try {
        const data = await contract.totalSupply();
        setRaiderSupply((ethers.utils.formatEther(data)));
      } catch (err) {
        console.log("error: ", err);
      }
    }
  }

  // Get the $RAIDER balance for an address
  const fetchRaiderBalance = async (address) => {
    if (typeof window.ethereum !== 'undefined') {
      const contract = setRaiderContract(setProvider());
      try {
        const data = await contract.balanceOf(address);
        return(ethers.utils.formatEther(data));
      } catch (err) {
        console.log("error: ", err);
      }
    }
  }

  // Get the current user's $RAIDER balance
  const fetchRaiderUserBalance = async () => {
    if (!userAddress) return;
    const balance = await fetchRaiderBalance(userAddress);
    setRaiderBalance(balance);
  }

  // request access to the user's MetaMask account
  const requestAccount = async () => {
    try {
      const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setConnected("Connected");
      setUserAddress(account[0]);
      setShortAddress("0x..." + account[0].slice(account[0].length - 5));
    } catch (err) {

    }
  }

  const setProvider = () => {
    try {
      return new ethers.providers.Web3Provider(window.ethereum);
    } catch (error) {
      console.log("setProvider error: ", error)
    }
  }

  useEffect(() =>{
    requestAccount();
  },[])

  return (
    <div className="App">
      <Head>
        <link href="https://cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" rel="stylesheet" />
        <title>Raider Bank</title>
      </Head>
      <Menu>
        <Menu.Item>🏦 Raider Bank</Menu.Item>
        <Menu.Item position="right">
            <Button className="menuButton" href="https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=0x34d4ab47Bee066F361fA52d792e69AC7bD05ee23" target="_blank">Buy AURUM ${Number.parseFloat(aurumPrice).toFixed(3)}</Button>
        </Menu.Item>
        <Menu.Item>
          <Button className="menuButton" href="https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=0xcd7361ac3307D1C5a46b63086a90742Ff44c63B3" target="_blank">Buy RAIDER ${Number(raiderPrice).toLocaleString()}</Button>
        </Menu.Item>
        <Menu.Item>
          <p className="address">{shortAddress}</p>
        </Menu.Item>
        <Menu.Item>
          <Button onClick={requestAccount}>{connected}</Button>
        </Menu.Item>
      </Menu>
      <div className="container mainBody">
        <h1 >Your Wallet</h1>
        <div className="tokenInfoContainer">
          <div className="tokenInfoSection">
            <div className="tokenInfoBox">
              <p className="bigNumberDescription">$RAIDER Balance</p>
              <p className="bigNumber">{Number(raiderBalance).toLocaleString()}</p>
            </div>
            <div className="tokenInfoBox">
              <p className="bigNumberDescription">$AURUM Balance</p>
              <p className="bigNumber">{Number(aurumBalance).toLocaleString()}</p>
            </div>
          </div>
        </div>
        <br></br>
        <br></br>
        <Staking 
          setProvider={setProvider} 
          userAddress={userAddress} 
          raiderPrice={raiderPrice} 
          aurumPrice={aurumPrice} 
          raiderMaticPrice={raiderMaticPrice} 
          aurumMaticPrice={aurumMaticPrice}
          aurumUsdcPrice={aurumUsdcPrice}
          raiderEthPrice={raiderEthPrice}
        />
      </div>
    </div>
  )
};

export async function getStaticProps() {

  const maticUSD = await axios.get('https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0&vs_currencies=usd').then((res) => {return res.data['0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0'].usd});
  const ethUSD = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd').then((res) => {return res.data['ethereum'].usd});

  // Sometimes Sushi changes if it prices in MATIC or ETH, you can change that here too.
  const basePrice = ethUSD;

  const APIURL = "https://api.thegraph.com/subgraphs/name/sushiswap/matic-exchange";

  const lpQuery = (lpId) => {
    return (
      `
        query{
          pair (id: "${lpId}") {
            trackedReserveETH,
            totalSupply,
            token0{
              symbol,
              derivedETH
            },
            token1{
              symbol,
              derivedETH
            }
          }
        }
      `
    )
  };

  const client = new ApolloClient({  
    uri: APIURL,  
    cache: new InMemoryCache()
  });

  const raiderMaticPrice = await client.query({query: gql(lpQuery('0x2e7d6490526c7d7e2fdea5c6ec4b0d1b9f8b25b7'))})
    .then((res) => {return ((res.data.pair.trackedReserveETH * basePrice) / res.data.pair.totalSupply)});

  const raiderPrice = await client.query({query: gql(lpQuery('0x2e7d6490526c7d7e2fdea5c6ec4b0d1b9f8b25b7'))})
    .then((res) => {return (res.data.pair.token1.derivedETH * basePrice)});

  const aurumMaticPrice = await client.query({query: gql(lpQuery('0x91670a2a69554c61d814cd7f406d7793387e68ef'))})
  .then((res) => {return ((res.data.pair.trackedReserveETH * basePrice) / res.data.pair.totalSupply)});
  
  const aurumUsdcPrice = await client.query({query: gql(lpQuery('0xabee7668a96c49d27886d1a8914a54a5f9805041'))})
  .then((res) => {return ((res.data.pair.trackedReserveETH * basePrice) / res.data.pair.totalSupply)});
  
  const raiderEthPrice = await client.query({query: gql(lpQuery('0x426a56f6923c2b8a488407fc1b38007317ecafb1'))})
  .then((res) => {return ((res.data.pair.trackedReserveETH * basePrice) / res.data.pair.totalSupply)});

  const aurumPrice = await client.query({query: gql(lpQuery('0x91670a2a69554c61d814cd7f406d7793387e68ef'))})
  .then((res) => {return (res.data.pair.token1.derivedETH * basePrice)});

  return {
    props: {
      raiderMaticPrice,
      raiderPrice,
      aurumMaticPrice,
      aurumUsdcPrice,
      raiderEthPrice,
      aurumPrice
    },
    revalidate: 30
  }
} 
