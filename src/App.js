import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

const DocumentExchangeApp = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [isMetamaskConnected, setIsMetamaskConnected] = useState(false);
  const [documentHash, setDocumentHash] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [connectedAccount, setConnectedAccount] = useState('');
  const [transactionStatus, setTransactionStatus] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [hashToVerify, setHashToVerify] = useState('');
  const [verificationResult, setVerificationResult] = useState('');
  const [receivedHashes, setReceivedHashes] = useState([]);
  const [receivedHashesHistory, setReceivedHashesHistory] = useState([]);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
  
        // Detect account changes
        window.ethereum.on('accountsChanged', (accounts) => {
          console.log('Account changed:', accounts[0]);
          setConnectedAccount(accounts[0]);
        });
        try {
          const accounts = await window.ethereum.enable();
          setWeb3(web3Instance);
          setConnectedAccount(accounts[0]);
          setIsMetamaskConnected(true);

          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = 5; // Assuming Goerli testnet
          const contractAddress = '0xf8e81D47203A594245E36C48e151709F0C19fBe8'; 

          const contractInstance = new web3Instance.eth.Contract(
            [
              {
                "inputs": [],
                "stateMutability": "nonpayable",
                "type": "constructor"
              },
              {
                "anonymous": false,
                "inputs": [
                  {
                    "indexed": true,
                    "internalType": "bytes32",
                    "name": "documentHash",
                    "type": "bytes32"
                  },
                  {
                    "indexed": true,
                    "internalType": "address",
                    "name": "uploader",
                    "type": "address"
                  }
                ],
                "name": "DocumentUploaded",
                "type": "event"
              },
              {
                "anonymous": false,
                "inputs": [
                  {
                    "indexed": true,
                    "internalType": "address",
                    "name": "sender",
                    "type": "address"
                  },
                  {
                    "indexed": true,
                    "internalType": "address",
                    "name": "recipient",
                    "type": "address"
                  },
                  {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "hash",
                    "type": "bytes32"
                  }
                ],
                "name": "HashSentToRecipient",
                "type": "event"
              },
              {
                "anonymous": false,
                "inputs": [
                  {
                    "indexed": true,
                    "internalType": "bytes32",
                    "name": "documentHash",
                    "type": "bytes32"
                  },
                  {
                    "indexed": true,
                    "internalType": "address",
                    "name": "verifier",
                    "type": "address"
                  }
                ],
                "name": "HashVerified",
                "type": "event"
              },
              {
                "inputs": [
                  {
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                  }
                ],
                "name": "documentRegistry",
                "outputs": [
                  {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                  }
                ],
                "stateMutability": "view",
                "type": "function"
              },
              {
                "inputs": [
                  {
                    "internalType": "address",
                    "name": "user",
                    "type": "address"
                  }
                ],
                "name": "getReceivedHashesForAddress",
                "outputs": [
                  {
                    "internalType": "bytes32[]",
                    "name": "",
                    "type": "bytes32[]"
                  }
                ],
                "stateMutability": "view",
                "type": "function"
              },
              {
                "inputs": [],
                "name": "getVerifiedHashes",
                "outputs": [
                  {
                    "internalType": "bytes32[]",
                    "name": "",
                    "type": "bytes32[]"
                  }
                ],
                "stateMutability": "view",
                "type": "function"
              },
              {
                "inputs": [],
                "name": "owner",
                "outputs": [
                  {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                  }
                ],
                "stateMutability": "view",
                "type": "function"
              },
              {
                "inputs": [
                  {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                  }
                ],
                "name": "receivedHashes",
                "outputs": [
                  {
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                  }
                ],
                "stateMutability": "view",
                "type": "function"
              },
              {
                "inputs": [
                  {
                    "internalType": "bytes32",
                    "name": "documentHash",
                    "type": "bytes32"
                  }
                ],
                "name": "registerDocument",
                "outputs": [],
                "stateMutability": "view",
                "type": "function"
              },
              {
                "inputs": [
                  {
                    "internalType": "bytes32",
                    "name": "documentHash",
                    "type": "bytes32"
                  },
                  {
                    "internalType": "address",
                    "name": "recipient",
                    "type": "address"
                  }
                ],
                "name": "sendHashToRecipient",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
              },
              {
                "inputs": [
                  {
                    "internalType": "uint256",
                    "name": "newCost",
                    "type": "uint256"
                  }
                ],
                "name": "setStandardTransactionCost",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
              },
              {
                "inputs": [],
                "name": "standardTransactionCost",
                "outputs": [
                  {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                  }
                ],
                "stateMutability": "view",
                "type": "function"
              },
              {
                "inputs": [
                  {
                    "internalType": "bytes32",
                    "name": "documentHash",
                    "type": "bytes32"
                  }
                ],
                "name": "uploadDocument",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
              },
              {
                "inputs": [
                  {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                  }
                ],
                "name": "verifiedHashes",
                "outputs": [
                  {
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                  }
                ],
                "stateMutability": "view",
                "type": "function"
              },
              {
                "inputs": [
                  {
                    "internalType": "bytes32",
                    "name": "documentHash",
                    "type": "bytes32"
                  }
                ],
                "name": "verifyHash",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
              }
            ], 
            contractAddress
          );
          setContract(contractInstance);
        } catch (error) {
          console.error('Error connecting to Metamask:', error);
        }
      } else {
        console.error('Metamask not found');
      }
    };

    initWeb3();
  }, []);

  const handleConnectMetamask = async () => {
    try {
      const accounts = await window.ethereum.enable();
      setConnectedAccount(accounts[0]);
      setIsMetamaskConnected(true);
    } catch (error) {
      console.error('Error connecting to Metamask:', error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUploadDocument = async () => {
    if (selectedFile) {
      const fileReader = new FileReader();
      fileReader.onload = async (event) => {
        const fileContent = event.target.result;
        const hash = web3.utils.sha3(fileContent);
        setDocumentHash(hash);

        try {
          await contract.methods.uploadDocument(hash).send({ from: connectedAccount });
          setTransactionStatus('Transaction successful!');
          console.log('Document uploaded to the blockchain:', hash);
        } catch (error) {
          setTransactionStatus('Transaction failed');
          console.error('Error uploading document:', error);
        }
      };

      fileReader.readAsText(selectedFile);
    } else {
      console.error('No file selected.');
    }
  };

  const handleRegisterDocument = async () => {
    if (documentHash) {
      try {
        await contract.methods.registerDocument(documentHash).send({ from: connectedAccount });
        setTransactionStatus('Transaction successful!');
        console.log('Document registered on the blockchain:', documentHash);
      } catch (error) {
        setTransactionStatus('Transaction failed');
        console.error('Error registering document:', error);
      }
    } else {
      console.error('No document hash to register.');
    }
  };

  const handleRecipientAddressChange = (event) => {
    setRecipientAddress(event.target.value);
  };

  const handleSendHash = async () => {
    if (documentHash && recipientAddress) {
      try {
        await contract.methods.sendHashToRecipient(documentHash, recipientAddress)
          .send({ from: connectedAccount });

        setTransactionStatus(`Hash sent to ${recipientAddress} successfully!`);
        console.log(`Hash sent to ${recipientAddress} successfully:`, documentHash);
      } catch (error) {
        setTransactionStatus(`Failed to send hash to ${recipientAddress}`);
        console.error('Error sending hash:', error);
      }
    } else {
      console.error('Document hash or recipient address missing.');
    }
  };

  const handleGetReceivedHashes = async () => {
    try {
      const hashes = await contract.methods.getReceivedHashes().call({ from: connectedAccount });
      console.log('Received Hashes:', hashes);
      setReceivedHashes(hashes);
  
      setReceivedHashesHistory((prevHistory) => [...prevHistory, { timestamp: new Date(), hashes }]);
    } catch (error) {
      console.error('Error getting received hashes:', error);
    }
  };
  
  const handleHashToVerifyChange = (event) => {
    setHashToVerify(event.target.value);
  };

  const handleVerifyHash = async () => {
    try {
      console.log('Verifying hash:', hashToVerify);
      console.log('Connected account:', connectedAccount);
  
      const result = await contract.methods.verifyHash(hashToVerify).call({ from: connectedAccount });
      setVerificationResult(result ? 'Hash is registered!' : 'Hash is not registered.');
      console.log('Verification Result:', result);
    } catch (error) {
      setVerificationResult('Error verifying hash');
      console.error('Error verifying hash:', error);
    }
  };

  return (
    <div>
      {<div>
      <h1>Document Exchange App</h1>
      <button onClick={handleConnectMetamask}>Connect Metamask</button>
      <p>{isMetamaskConnected ? `Metamask Connected - Account: ${connectedAccount}` : 'Metamask Not Connected'}</p>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUploadDocument}>Upload Document</button>
      <p>Document Hash: {documentHash}</p>
      <button onClick={handleRegisterDocument}>Register Document</button>
      <input
        type="text" 
        placeholder="Hash to Verify"
        value={hashToVerify}
        onChange={handleHashToVerifyChange}
      />
      <button onClick={handleVerifyHash}>Verify Hash</button>
      <p>{verificationResult}</p>
      <p>{transactionStatus}</p>
      </div>}
      <input
        type="text"
        placeholder="Recipient's Metamask Address"
        value={recipientAddress}
        onChange={handleRecipientAddressChange}
      />
      <button onClick={handleSendHash}>Send Hash</button>
      <button onClick={handleGetReceivedHashes}>Get Received Hashes</button>
      <ul>
        {receivedHashes.map((hash, index) => (
          <li key={index}>{`Hash ${index + 1}: ${hash}`}</li>
        ))}
      </ul>

      {/* Display received hashes history */}
      <h2>Received Hashes History:</h2>
      <ul>
        {receivedHashesHistory.map((entry, index) => (
          <li key={index}>
            {`Timestamp: ${entry.timestamp.toLocaleString()} - Hashes: ${entry.hashes.join(', ')}`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentExchangeApp;
