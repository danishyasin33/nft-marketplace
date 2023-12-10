import './App.css';
import { useEffect, useState } from 'react';
import { NFT_CONTRACT_ABI, NFT_CONTRACT_ADDRESS } from './config';
import Web3 from 'web3';


function App () {
  const [address, setAddress] = useState('');
  const [adminAddress, setAdminAddress] = useState('');
  const [nftContract, setContract] = useState('');
  const [tokenPrice, setTokenPrice] = useState(0);
  const [tokenURI, setTokenURI] = useState('https://s3-prod.dogtopia.com/wp-content/uploads/2019/03/0.jpg');
  const [tokenURIValue, settokenURIValue] = useState('');
  const [tokens, setTokens] = useState([
    { tokenId: 1, tokenURI: 'https://s3-prod.dogtopia.com/wp-content/uploads/2019/03/0.jpg' }
  ])

  const [mintAddress, setMintAddress] = useState('');
  const [mintTokenNum, setMintTokenNum] = useState(0);

  const [minted, setMinted] = useState(false);


  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(accounts => {
          setAddress(accounts[0])
        })
    } else {
      console.log('MetaMask is not installed!')
    }

    const initWeb3 = async () => {
      if (typeof web3 !== 'undefined') {
        var web3 = new Web3(web3.currentProvider);
      } else {
        var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
      }

      setContract(new web3.eth.Contract(NFT_CONTRACT_ABI, NFT_CONTRACT_ADDRESS))
    }

    initWeb3();
  }, [])

  useEffect(() => {
    const getPrice = async () => {
      if (nftContract === '') return;
      try {
        const price = await nftContract.methods.getPrice().call();
        setTokenPrice(price);
      } catch (error) {
        console.log('error fetching price: ', error)
      }

      try {
        const admin = await nftContract.methods.owner().call();
        setAdminAddress(admin);
      } catch (error) {
        console.log('error fetching admin address: ', error)
      }
    }

    getPrice();
  }, [nftContract])

  useEffect(() => {
    const getCollection = async () => {
      if (nftContract === '') return;
      const balance = await nftContract.methods.balanceOf(address).call();
      console.log('balance: ', balance)
      if (balance === 0) return;

      for (let i = 0; i < balance; i++) {
        const tokenId = await nftContract.methods.tokenOfOwnerByIndex(address, i).call();
        const tokenURI = await nftContract.methods.tokenURI(tokenId).call();
        console.log('tokenURI: ', tokenURI)

        if (tokens.filter(token => token.tokenId === tokenId).length > 0) {
          return;
        }

        setTokens([...tokens, { tokenId, tokenURI }])
      }
    }
    getCollection();
  }, [address])

  const mintToken = async () => {
    console.log('mintAddress: ', mintAddress);
    console.log('mintTokenNum: ', mintTokenNum);

    if (!nftContract || !address || !tokenPrice) return;
    try {
      nftContract.methods.safeMint(mintAddress, mintTokenNum, tokenURI).send({ from: address, value: tokenPrice, gas: 3000000 })

      setMinted(true);
      setTimeout(() => {
        setMinted(false);
      }, 2000)
    } catch (error) {
      console.log('error: ', error)
    }
  }

  const burnToken = async (tokenId) => {
    console.log('tokenId: ', tokenId)
    if (!nftContract || !address) return;
    try {
      nftContract.methods.burn(tokenId).send({ from: address, gas: 3000000 })
      setTokens(tokens.filter(token => token.tokenId !== tokenId));
    } catch (error) {
      console.log('error: ', error)
    }
  }

  const updateTokenURI = async () => {
    if (adminAddress != address) return;
    setTokenURI(tokenURIValue);
  }



  return (
    <div className="bg-gray-300 h-screen w-screen flex flex-col">
      <header className="w-screen grow-1 bg-slate-400 h-20 flex justify-end px-4 items-center font-bold">
        <h1>Active Address: {address}</h1>
      </header>
      <div className="flex w-full mx-5 my-5 items-center">
        <h2 className='text-bold text-xl'>Price of Tokens: </h2> <p className='ml-5 font-semibold'>{tokenPrice} ETH</p>
      </div>
      <div className='mt-10 mx-5'>
        <h2 className='text-2xl font-bold'>MINT/BUY NFT</h2>
        <div className='flex flex-col'>
          <label className='flex gap-4 font-medium text-lg my-4 w-full items-center'>
            Address
            <input type='text' placeholder='0x9Bbc4aee49329.......Ec928fe4459478' onChange={(event) => setMintAddress(event.target.value)} className='p-2 w-2/5 bg-slate-200 rounded' value={mintAddress}></input>
          </label>
          <label className='flex gap-4 font-medium text-lg my-4 w-full items-center'>
            Token Num
            <input type='number' min='1' className='p-2 w-1/5 bg-slate-200 rounded' onChange={(event) => setMintTokenNum(event.target.value)} value={mintTokenNum}></input>
          </label>
          <button className='bg-slate-400 p-2 rounded text-white font-bold' onClick={mintToken}>MINT NFT</button>
        </div>
      </div>

      <div className='mt-20 mx-5'>
        <h2 className='text-2xl font-bold mb-5'>Your NFT Collection</h2>
        <div className='flex gap-4'>
          {tokens.map(token => (
            <div className='flex flex-col items-center rounded border-2 border-neutral-800 bg-slate-100 hover:shadow-lg' key={token.tokenId}>
              <img src={token.tokenURI} alt='token uri' width={400} height={400}></img>
              <p className='font-bold'>Token ID: {token.tokenId}</p>
              <button className='button bg-red-700 text-white rounded px-3 py-2 my-4' onClick={() => burnToken(token.tokenId)}>Burn Token</button>
            </div>
          ))}
        </div>
      </div>
      <div className='mt-20 mb-10 mx-5'>
        <h2 className='text-2xl font-bold mb-5'>Update Token URI (Admin Only)</h2>
        <div className='flex gap-4 w-full'>
          <label className='flex gap-4 text-xl font-bold items-center w-full'>
            Token URI
            <input type='url' className='p-2 w-3/5 bg-slate-200 rounded grow' placeholder='https://s3-prod.dogtopia.com/wp-content/uploads/2019/03/0.jpg' value={tokenURIValue} onChange={(event) => settokenURIValue(event.target.value)}></input>
          </label>
          <button className='button bg-red-700 text-white rounded px-3 py-2  w-1/5' onClick={updateTokenURI}>
            Update Token URI
          </button>
        </div>
      </div>

      {
        minted && (
          <div className='fixed bottom-5 mx-5 mt-10 p-4 rounded w-3/4 bg-green-300 font-bold text-lg'>
            <p className=''>✅ Minted sucessfully!</p>
          </div>
        )
      }
    </div >
  );
}

export default App;
