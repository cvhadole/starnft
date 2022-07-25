import React from "react";
import './Card.css'
import {Routes, Route, useNavigate} from 'react-router-dom';

function Card({ name, imagePath, description,id}) {

    const navigate = useNavigate();

    function buyNowClick(id){

        console.log('id click',id);
        navigate(`/buynft/${id}`);
    }
    return (
        // <div className="card col-md-4" >
        //     <img src={imagePath} alt="Avatar" style={{width:"100%"}} />
        //         <div className="container">
        //             <h4><b>{name}</b></h4>
        //             <p>Interior Designer</p>
        //         </div>
        // </div>
          <div className="col-md-4">
            <div className="card">
            <img src={imagePath} alt="Avatar" style={{width:"100%"}} />
            <h4><b>{name}</b></h4>
            <p>{description}</p>
            <button className="btn btn-primary" onClick={()=>buyNowClick(id)}>Buy now</button>
            </div>
        </div>
    )
}
export default Card