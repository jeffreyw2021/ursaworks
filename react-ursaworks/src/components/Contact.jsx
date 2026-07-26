import React from 'react';
import content from "../content.json";
import emailIcon from '../assets/logoItems/emailIcon.svg';
import insIcon from '../assets/logoItems/insIcon.svg';
import '../styles/contactStyle.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

export default function Contact({ contactRef }) {
    const { email, instagramHandle, instagramUrl, arcWebsite, officers } = content.contact;

    return (
        <div className="infoBlock" id="contactBlock" ref={contactRef}>
            <h2 className="sectionTitle">Contact Us</h2>

            <div className="contactContent">
                <div className="contactLinks">
                    <a className="contactLink" href={`mailto:${email}`}>
                        <img src={emailIcon} alt="Email" />
                        <span>{email}</span>
                    </a>
                    <a className="contactLink" href={instagramUrl} target="_blank" rel="noopener noreferrer">
                        <img src={insIcon} alt="Instagram" />
                        <span>{instagramHandle}</span>
                    </a>
                    <a className="contactLink" href={arcWebsite} target="_blank" rel="noopener noreferrer">
                        <span>ARC Robotics Competition</span>
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                    </a>
                </div>

                <div className="contactOfficers">
                    <h3>Leadership</h3>
                    <div className="officerList">
                        {officers.map((officer, index) => (
                            <div className="officerCard" key={index}>
                                <h5>{officer.name}</h5>
                                <p className="officerRole">{officer.role}</p>
                                <a className="officerEmail" href={`mailto:${officer.email}`}>{officer.email}</a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
