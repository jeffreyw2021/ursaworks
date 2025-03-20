import React from 'react';
import BearBg from '../assets/logoItems/BearBg.svg';
import stars from '../assets/logoItems/starAndBear.svg';
import '../styles/heroStyle.css';

export default function Hero() {
    return (
        <div className="hero">
            {/* <img src={BearBg} className="heroBg" alt="Background" /> */}
            <div className="heroContent">
                <img src={stars} className="stars" alt="Stars" />
                <h1 className="title">ROBOMASTERS</h1>
                <h2 className="subtitle">From Washington University in St.Louis</h2>
            </div>
        </div>
    );
}
