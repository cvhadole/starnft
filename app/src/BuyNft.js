import React ,{useState} from "react";
import { useLocation ,useParams,useNavigate} from 'react-router-dom';
import data from './constant/data'
 function BuyNft() {
     
    const navigate = useNavigate();
    function onBackClick(){
        navigate('/marketplace')
    }
    
    let { id } = useParams();
    //const [value, setValue] = useState(null);
    let value= null;
    if(id){
        value = data.filter(x=>x.id==id)[0];

    } 

    function buyNowClick(){
        alert('Not available for sale');
    }
    
    return (
        <>
        {
            value != null ? (
                <>
        <div className="row">
            <div className="col-md-6">
                <div className="card">
                    <img src={value.imagePath} alt="Avatar" style={{ width: "60%" }} />

                </div>
            </div>
            <div className="col-md-6">
                <div className="row">
                    <div className="col-md-12">
                        <div className="row">
                            <div className="col-6" style={{ fontSize: "35px" }}><strong>NFT Name :</strong> </div>
                            <div className="col-md-6" style={{ fontSize: "35px" }}><label>{value.name}</label></div>
                        </div>

                        <div className="row">
                            <div className="col-6" style={{ fontSize: "35px" }}><strong>Own By :</strong> </div>
                            <div className="col-md-6" style={{ fontSize: "35px" }}><label>{value.ownerName}</label></div>
                        </div>
                        <div className="row">
                            <div className="col-6" style={{ fontSize: "35px" }}><strong>Price :</strong> </div>
                            <div className="col-md-6" style={{ fontSize: "35px" }}><label>{value.price} <stronge>Sol</stronge></label></div>
                        </div>
                        <div className="row">
                            <button className="btn btn-primary" onClick={buyNowClick} style={{ width:"20%"}}>Buy Now </button>
                        </div>
                        <div className="row">
                            <div className="col-md-12" style={{ fontSize: "35px" }}><strong>Description :</strong></div>
                        </div>
                        <p> <label style={{fontSize: "35px"}}>{value.description}</label></p>

                    </div>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-md-12">
                <label> Details</label>
            </div>
            <div className="col-md-6 card">
                <div className="row">
                <div className="col-md-6"><label>Contract Address</label></div> 
                <div className="col-md-6"><label>0x1bb6...0916</label></div> 
                </div>
                <div className="row">
                <div className="col-md-6"><label>Token ID</label></div> 
                <div className="col-md-6"><label>4412</label></div> 
                </div>
                <div className="row">
                <div className="col-md-6"><label>Token Standard</label></div> 
                <div className="col-md-6"><label>ERC-721</label></div> 
                </div>
                <div className="row">
                <div className="col-md-6"><label>Blockchain</label></div> 
                <div className="col-md-6"><label>Solana</label></div> 
                </div>
                <div className="row">
                <div className="col-md-6"><label>Creator Fees</label></div> 
                <div className="col-md-6"><label>5%</label></div> 
                </div>
               
            </div>
            <div className="col-md-6"></div>
        </div></>
        ) : null

        }
        <div className="row" style={{marginTop:"20px"}}>
            <div className="col-md-3" style={{ width: "100%"}}>
                <button className="btn btn-secondary" onClick={onBackClick}> Back </button>
            </div>
        </div>
        </>
    )
}

export default BuyNft