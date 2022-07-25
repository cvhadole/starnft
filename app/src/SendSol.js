import {
    clusterApiUrl,
    Connection,
    Transaction,
    Keypair,
    PublicKey,
    LAMPORTS_PER_SOL,
    sendAndConfirmTransaction,
    SystemProgram
} from '@solana/web3.js';
import {
    getAccount,
    getAssociatedTokenAddress,
    NATIVE_MINT,
    createAssociatedTokenAccountInstruction,
    createSyncNativeInstruction,
    transfer,
    getOrCreateAssociatedTokenAccount,
    closeAccount
} from '@solana/spl-token';

import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';

import { useState, useEffect } from "react"

function SendSol() {
    debugger;
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const fromWallet = Keypair.generate();
    const wallet = useWallet();

    // const [account, setAccount] = useState(null);
    //const [showLoading, setShowLoading] = useState(false);

    let showLoading=false;
    // const [showSendSolLoading, setShowSendSolLoading] = useState(false);
    let showSendSolLoading=false;

    // const { account, transactions } = useSolanaAccount();

    // function useSolanaAccount() {
    //     const [account, setAccount] = useState(null);
    //     const [transactions, setTransactions] = useState(null);

    //     async function init() {
    //       let acc = await connection.getAccountInfo(wallet.publicKey);
    //       setAccount(acc);
    //       let transactions = await connection.getConfirmedSignaturesForAddress2(
    //         wallet.publicKey,
    //         {
    //           limit: 10,
    //         }
    //       );
    //       setTransactions(transactions);
    //     }

    //     useEffect(() => {
    //       setInterval(init, 10000);
    //     }, transactions);

    //     return { account, transactions };
    //   }


    let associatedTokenAccount;

    async function wrapSol() {
        debugger;
        try {

           
            const airdropSignature = await connection.requestAirdrop(
                fromWallet.publicKey,
                2 * LAMPORTS_PER_SOL,
            );

            await connection.confirmTransaction(airdropSignature);
            associatedTokenAccount = await getAssociatedTokenAddress(
                NATIVE_MINT,
                fromWallet.publicKey
            );

            // Create token account to hold your wrapped SOL
            const ataTransaction = new Transaction().add(
                createAssociatedTokenAccountInstruction(
                    fromWallet.publicKey,
                    associatedTokenAccount,
                    fromWallet.publicKey,
                    NATIVE_MINT
                )
            );

            await sendAndConfirmTransaction(connection, ataTransaction, [fromWallet]);

            // Transfer SOL to associated token account and use SyncNative to update wrapped SOL balance
            const solTransferTransaction = new Transaction()
                .add(
                    SystemProgram.transfer({
                        fromPubkey: fromWallet.publicKey,
                        toPubkey: associatedTokenAccount,
                        lamports: LAMPORTS_PER_SOL // the SOL that we're sending over
                    }),
                    createSyncNativeInstruction(
                        associatedTokenAccount
                    )
                );

            await sendAndConfirmTransaction(connection, solTransferTransaction, [fromWallet]);
            const accountInfo = await getAccount(connection, associatedTokenAccount);
            console.log(`Native: ${accountInfo.isNative}, Lamports: ${accountInfo.amount}`);
           // setShowLoading(false);

         

           alert('Sol wrap successfully');

        } catch (error) {
            //setShowLoading(false);
            
            alert(error);
        }

    }

    async function unwrapSol() {
        const walletBalance = await connection.getBalance(fromWallet.publicKey);
        console.log(`Balance before unwrapping WSOL: ${walletBalance}`)
        await closeAccount(
            connection,
            fromWallet,
            associatedTokenAccount,
            fromWallet.publicKey,
            fromWallet
        );
        const walletBalancePostClose = await connection.getBalance(fromWallet.publicKey);
        console.log(`Balance after unwrapping WSOL: ${walletBalancePostClose}`);

        
    }

    async function sendSolTo() {
        debugger;
        try {

            //setShowSendSolLoading(true);
            // airdrop SOL to send
            const fromAirdropSignature = await connection.requestAirdrop(fromWallet.publicKey, LAMPORTS_PER_SOL);

            // Wait for airdrop confirmation
            await connection.confirmTransaction(fromAirdropSignature);

            // Generate a new wallet to receive newly minted token
            //const toWallet = new PublicKey("INSERT YOUR PUBLIC KEY HERE")

            // Get the token account of the fromWallet address, and if it does not exist, create it
            const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                fromWallet,
                NATIVE_MINT,
                fromWallet.publicKey
            );

            // Get the token account of the toWallet address, and if it does not exist, create it
            const toTokenAccount = await getOrCreateAssociatedTokenAccount(connection, fromWallet, NATIVE_MINT, wallet.publicKey);

            // Transfer the new token to the "toTokenAccount" we just created
            const signature = await transfer(
                connection,
                fromWallet,
                fromTokenAccount.address,
                toTokenAccount.address,
                fromWallet.publicKey,
                LAMPORTS_PER_SOL
            );
            console.log('Transfer tx:', signature);
           // setShowSendSolLoading(false);
           showSendSolLoading=false;

           alert(`Sol send successfully to ${wallet.publicKey}`);

        } catch (error) {
            alert(error);
        }

    }

    return (
        <div className='container'>
           <div  style={{ margin: "10px" }}></div> Send Sol To Account
            <div>
                <button className='btn btn-primary mr-2' style={{ margin: "10px" }} onClick={wrapSol}>
                    {showLoading ? <i class="fa fa-refresh fa-spin"></i> : null}
                    Wrap SOL</button>
                {/* <button onClick={unwrapSol}>Unwrap SOL</button> */}
               
                <button className='btn btn-success ml-2' style={{ margin: "10px" }} onClick={sendSolTo}>
                    {showSendSolLoading ? <i class="fa fa-refresh fa-spin"></i> : null}
                    Send SOL</button>
                 

                {/* {
                    transactions != null ? <label>{transactions}</label> : null
                } */}
            </div>
        </div>
    );
}

export default SendSol;
