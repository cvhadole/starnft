import './App.css';
import { useState ,useMemo} from 'react';
import { Connection, PublicKey,clusterApiUrl } from '@solana/web3.js';
import {
  Program, AnchorProvider, web3
} from '@project-serum/anchor';
import idl from './idl.json';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { useWallet, WalletProvider, ConnectionProvider} from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Sidebar from './Sidebar';
import { BrowserRouter as Router ,Routes,Route,useNavigate} from 'react-router-dom';
import Startup from './Startup'
import Menubar from './MenuBar';
import Home from './Home';
import BuyNft from './BuyNft';
import MintToken from './MintToken';
import MintNft from './MintNft';
import SendSol from './SendSol';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
require('@solana/wallet-adapter-react-ui/styles.css');

const wallets = [
  /* view list of available wallets at https://github.com/solana-labs/wallet-adapter#wallets */
  new PhantomWalletAdapter()
]

const { SystemProgram, Keypair } = web3;
/* create an account  */
const baseAccount = Keypair.generate();
const opts = {
  preflightCommitment: "processed"
}

const programID = new PublicKey(idl.metadata.address);


function App() {

 /*
 Mainnet = "mainnet-beta",
    Testnet = "testnet",
    Devnet = "devnet"
 */

   const solNetwork = WalletAdapterNetwork.Testnet; 
    const endpoint = useMemo(() => clusterApiUrl(solNetwork), [solNetwork]);
  const navigate = useNavigate();

  const [value, setValue] = useState(null);
  const wallet = useWallet();

  async function getProvider() {
    /* create the provider and return it to the caller */
    /* network set to local network for now */
    const network = "http://127.0.0.1:8899";

    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new AnchorProvider(
      connection, wallet, opts.preflightCommitment,
    );
    return provider;

  }

  async function createCounter() {
    debugger;
    const provider = await getProvider();
    /* create the program interface combining the idl, program ID, and provider */
    const program = new Program(idl, programID, provider);
    try {
      /* interact with the program via rpc */
      await program.rpc.create({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount]

      });

      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
      console.log('account: ', account);
      setValue(account.count.toString());

    }
    catch (err) {
      console.log("Transaction error: ", err);
    }

  }
  async function increment() {
    debugger;
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    await program.rpc.increment({
      accounts: {
        baseAccount: baseAccount.publicKey
      }
    })

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('account: ', account);
    setValue(account.count.toString());

  }
  /*
  if (!wallet.connected) {
    // If the user's wallet is not connected, display connect wallet button. 
    return (
      // <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
      //   <WalletMultiButton />
      // </div>
      <>
      
      <Startup />
      </>
    )
  } else {
    return (
      <div className="App">
         
          <div>
             <Menubar />
            <Sidebar />
          </div>
        </div>
       
    )
  }*/
  function disconnectedClick(){
    wallet.disconnect();
    navigate(`/`);
  }
  function connectClick(){
    debugger;
    // const connect= getProvider();
    // connect.connect();
    
  }
  return (
  
    <Routes>
    {
      !wallet.connected ? (
        <>
         <Route path="/" element={<Startup connectClick={connectClick}/>} />
        </>
      ):(
        <>
        <Route path="/" element={<Menubar disconnectedClick={disconnectedClick} />}>
        <Route path="marketplace" element={<Home />} />
         <Route path="/buynft/:id" element={<BuyNft />} />  
         <Route path="/minttoken" element={<MintToken />} /> 
         <Route path="/mintnft" element={<MintNft />} /> 
         <Route path="/sendsol" element={<SendSol />} />
        </Route>
        </>
      )
    }
    </Routes>
    
  
  )
}
// endpoint="http://127.0.0.1:8899"
  /* wallet configuration as specified here: https://github.com/solana-labs/wallet-adapter#setup */
const AppWithProvider = () => (
  <ConnectionProvider endpoint="http://127.0.0.1:8899">
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
      <Router>
        <App />
        </Router>
      </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>
)

export default AppWithProvider;
