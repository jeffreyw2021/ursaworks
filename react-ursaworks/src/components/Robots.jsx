import React from 'react';
import loadImage from '../configs/loadImages';
import content from "../content.json";

import '../styles/robotsStyle.css';

export default function Robots({ robotsRef }) {
    return (
        <div className="infoBlock" id="robotsBlock" ref={robotsRef}>
            <div className="ourRobot">
                <h2 className="sectionTitle">Types of Robots</h2>
                {content.robots.map((robot, index) => (
                    <div className="robot" key={index}>
                        <img src={loadImage('robots', robot.image)} alt={robot.name} className="robotImage" />
                        <div className="robotDesc">
                            <h3>{robot.name}</h3>
                            <p>{robot.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}