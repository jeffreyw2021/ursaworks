import React from 'react';
import loadImage from '../configs/loadImages';
import content from "../content.json";

import '../styles/aboutStyle.css';

export default function About({ aboutRef }) {

    return (
        <div className="infoBlock" id="aboutBlock" ref={aboutRef}>
            <div className="ourMission">
                <div className="aboutLeft">
                    <h2 className="sectionTitle">Our Mission</h2>
                    <p className="aboutDesc">{content.intro}</p>
                    {content.aboutHighlights.map((highlight) => (
                        <div className="highlightCard" key={highlight.name}>
                            <span className="highlightTag">{highlight.tag}</span>
                            <h3>{highlight.name}</h3>
                            <p>{highlight.description}</p>
                        </div>
                    ))}
                </div>
                <img src={loadImage('about', content.aboutImage)} alt="About" className="aboutImage" />
            </div>
            <div className="whatIsArc">
                <h2 className="sectionTitle">{content.arc.title}</h2>
                <p className="aboutDesc">{content.arc.description}</p>
            </div>
        </div>
    );
}
