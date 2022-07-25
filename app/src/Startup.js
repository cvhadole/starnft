
import React from "react";
import './Startup.css'

import {  WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Startup = ({connectClick}) => {

    const myStyle={
        backgroundImage: "url(assets/forestbridge.jpg)",
        height:'100vh',
        // marginTop:'-70px',
        fontSize:'25px',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center', 
        position: 'relative',
        color: 'white',
        fontFamily: 'Courier New, Courier, monospace' 
    };
    function walletConnected(qaaaa){
        console.log('connected')
    }

    return (
        
        <>
            <div style={myStyle}>
                <div className="topleft">
                    {/* <p>Logo</p> */}
                </div>
                <div className="middle">
                    <div>
                    <h1>Arieotech Hackathon</h1>
                    </div>
                    
                    <div>
                    {/* <button className="btn btn-primary" style={{magintop:"2px !important"}}> Lets start</button> */}
                    
                    <WalletMultiButton onClick={connectClick} connect={walletConnected}/>
                     
                    {/* <button className="btn btn-success" style={{marginLeft: "20px"}} onClick={connectClick}>Connect</button>  */}
                    </div>
                     
                   
                </div>
                <div className="bottomleft">
                    {/* <p>Some text</p> */}
                </div>
            </div>
        </>
    );

}

export default Startup