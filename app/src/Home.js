import React from "react";
import Card from './Card'
import data from './constant/data'
import {useState} from "react"
import './Home.css'
const Home =()=>{
    
    const [nftData, setNftData] = useState(data); 

    return(
        <div className="container">
        <div className="row">
            <div className="col-md-12">
            <h2>Market Place to buy NFT</h2>
            </div>
        </div>
        <div className="row" style={{ margin: "10px" }}>
            
            {
                
                
                nftData.map((item,index)=>{
                  return  <Card {...item} key={index}/>
                })
            }
            
        </div>
        </div>

    )
}
export default Home;