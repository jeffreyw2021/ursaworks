import React from 'react';
import loadImage from '../configs/loadImages';
import content from "../content.json";
import Paragraphs from './Paragraphs';
import NextPageLink from './NextPageLink';

import '../styles/robotsStyle.css';

export default function Robots({ robotsRef }) {
    return (
        <div className="infoBlock" id="robotsBlock" ref={robotsRef}>
            <div className="ourRobot">
                <h2 className="sectionTitle">Types of Robots</h2>
                <p className="robotsIntro">{content.ourRobot}</p>
                {content.robots.map((robot) => (
                    <div className="robot" key={robot.name}>
                        <img src={loadImage('robots', robot.image)} alt={robot.name} className="robotImage" />
                        <div className="robotDesc">
                            <span className="robotTag">{robot.tag}</span>
                            <h3>{robot.name}</h3>
                            <Paragraphs text={robot.description} />
                        </div>
                    </div>
                ))}
            </div>
            <NextPageLink to="/contact" label="Get In Touch" />
        </div>
    );
}
