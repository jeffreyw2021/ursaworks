import React from 'react';
import loadImage from '../configs/loadImages';
import content from '../json/content.json';
import '../styles/teamStyle.css';
import memberPlaceholder from '../assets/members/memberPlaceholder.png';

export default function Team({ teamsRef }) {
    return (
        <div className="infoBlock" id="teamBlock" ref={teamsRef}>
            <h2 className="sectionTitle">Our Team</h2>
            <div className="teamContent">
                {content.team.map((team, index) => (
                    <div className="teamMember" key={index}>
                        <img 
                            src={loadImage('members', team.image)} 
                            alt={team.name} 
                            onError={(e) => e.target.src = memberPlaceholder} 
                        />
                        <h5>{team.name}</h5>
                        <p>{team.position}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
