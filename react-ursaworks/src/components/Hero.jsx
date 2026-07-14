import React from 'react';
import stars from '../assets/logoItems/starAndBear.svg';
import '../styles/heroStyle.css';

export default function Hero() {
    return (
        <div className="hero">
            <div className="heroContent">
                <img src={stars} className="stars" alt="Stars" />
                <h1 className="title">URSAWORKS</h1>
                <h2 className="subtitle">AT WASHINGTON UNIVERSITY IN ST. LOUIS</h2>
            </div>
        </div>
    );
}
