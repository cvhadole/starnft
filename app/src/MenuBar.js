import './Menubar.css'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Outlet } from 'react-router-dom';

import { useWallet, WalletProvider, ConnectionProvider} from '@solana/wallet-adapter-react';
 
function Menubar({disconnectedClick}) {
 
  // function disconnectClick(){
  //   wallet.disconnect();
  // }
  return (
    <div>
       <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/marketplace">Home</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/marketplace">MarketPlace</Nav.Link>
            <Nav.Link href="/minttoken">Mint Token</Nav.Link>
            <Nav.Link href="/mintnft">Mint NFT</Nav.Link> 
            <Nav.Link href="/sendsol">Send Sol</Nav.Link> 
            
          </Nav>
          <button className='btn btn-secondary' onClick={()=>disconnectedClick()}>Disconnect</button>
        </Container>
      </Navbar>
      <Outlet />
    </div>
  );
}

export default Menubar;