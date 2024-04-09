import React, { useState, useEffect, createContext, useContext } from 'react';
import { ethers } from 'ethers';

// Create a context for the provider
const EthereumContext = createContext(null);

// Create a provider component
export const EthereumProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
    } else {
      console.error('Please install MetaMask!');
    }
  }, []);

  console.log("provider: ", provider)

  return (
    <EthereumContext.Provider value={provider}>
      {children}
    </EthereumContext.Provider>
  );
};

// Hook to use the provider
export const useEthereum = () => {
  const context = useContext(EthereumContext);
  if (context === null) {
    throw new Error('useEthereum must be used within a EthereumProvider');
  }
  return context;
};
