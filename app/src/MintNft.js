import {
    clusterApiUrl,
    Connection,
    PublicKey,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    sendAndConfirmTransaction
} from '@solana/web3.js';
import {
    createMint,
    getOrCreateAssociatedTokenAccount,
    mintTo,
    Account,
    createSetAuthorityInstruction,
    AuthorityType,
    transfer
} from '@solana/spl-token';

import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';


function MintNft() {

    debugger;
    const wallet = useWallet();
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    // Generate a new wallet keypair and airdrop SOL
    const fromWallet = Keypair.generate();
    let fromTokenAccount;
    let mint;

    async function createNft() {
        debugger;
        try {

            const fromAirdropSignature = await connection.requestAirdrop(fromWallet.publicKey, LAMPORTS_PER_SOL);
            debugger;
            await connection.confirmTransaction(fromAirdropSignature);

            // Create new NFT mint
            mint = await createMint(
                connection,
                fromWallet,
                fromWallet.publicKey,
                null,
                0 // only allow whole tokens
            );

            console.log(`Create NFT: ${mint.toBase58()}`);

            // Get the NFT account of the fromWallet address, and if it does not exist, create it
            fromTokenAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                fromWallet,
                mint,
                fromWallet.publicKey
            );

            console.log(`Create NFT Account: ${fromTokenAccount.address.toBase58()}`);

            // const signature = await mintTo(
            //     connection,
            //     fromWallet,
            //     mint,
            //     fromTokenAccount.address,
            //     fromWallet.publicKey,
            //     1
            // );
            // console.log(`Mint signature: ${signature}`);

            alert('NFT created');
        } catch (error) {
            debugger;
            alert(error);
        }

    }
    async function mintNft() {
        debugger;
        try {
            const signature = await mintTo(
                connection,
                fromWallet,
                mint,
                fromTokenAccount.address,
                fromWallet.publicKey,
                1
            );
            console.log(`Mint signature: ${signature}`);
            alert('NFT minted successfully');
        }
        catch (error) {
            debugger;
            alert(error);
        }
        // Mint 1 new token to the "fromTokenAccount" account we just created

    }
    async function lockNft() {
        debugger;
        try{
            // Create our transaction to change minting permissions
        let transaction = new Transaction().add(createSetAuthorityInstruction(
            mint,
            fromWallet.publicKey,
            AuthorityType.MintTokens,
            null
        ));

        // Send transaction
        const signature = await sendAndConfirmTransaction(connection, transaction, [fromWallet]);
        console.log(`Lock signature: ${signature}`);

        alert('NFT lcoked successfully');

        }catch(error){
            alert(error);
        }
        


    }

    async function sendNft() {
        debugger;
        try {
            // Get the token account of the toWallet address, and if it does not exist, create it
            const toTokenAccount = await getOrCreateAssociatedTokenAccount(connection, fromWallet, mint, wallet.publicKey);
            console.log(`toTokenAccount ${toTokenAccount.address}`);

            const signature = await transfer(
                connection,
                fromWallet,
                fromTokenAccount.address,
                toTokenAccount.address,
                fromWallet.publicKey,
                1 // 1 billion
            );
            console.log(`finished transfer with ${signature}`);
            alert(`NFT transfer successfully to ${wallet.publicKey}`);

        } catch (error) {
            alert(error);
        }

    }

    return (
        <div className='container'>
            <div style={{ margin: "10px" }}>Create Nft  & Transfer</div>
            <div>
                <button className='btn btn-primary' style={{ margin: "10px" }} onClick={createNft}>Create NFT </button>
                <button className='btn btn-secondary'  style={{margin:"10px"}} onClick={mintNft}>Mint NFT</button>
                <button className='btn btn-danger' style={{ margin: "10px" }} onClick={lockNft}>Lock NFT</button>
                <button className='btn btn-success' style={{ margin: "10px" }} onClick={sendNft}>Send NFT</button>
            </div>
        </div>
    );
}

export default MintNft;
