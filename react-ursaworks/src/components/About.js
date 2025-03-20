import React from 'react';
import loadImage from '../configs/loadImages';
import content from "content/content.json";

import '../styles/aboutStyle.css';

export default function About({ aboutRef }) {

    return (
        <div className="infoBlock" id="aboutBlock" ref={aboutRef}>
            <div className="ourMission">
                <div className="aboutLeft">
                    <h2 className="sectionTitle">Our Mission</h2>
                    <p className="aboutDesc">{content.intro}</p>
                </div>
                <img src={loadImage('about', content.aboutImage)} alt="About" className="aboutImage" />
            </div>
            <div className="ourRobot">
                <h2 className="sectionTitle">Our Robots</h2>
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
