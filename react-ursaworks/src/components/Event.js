import React from 'react';
import loadImage from '../configs/loadImages';
import content from "../content.json";
import locationIcon from '../assets/logoItems/locationIcon.svg';
import calendarIcon from '../assets/logoItems/calendarIcon.svg';
import '../styles/eventStyle.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

export default function Event({ eventsRef }) {
    const eventsToDisplay = content.events.slice(0, 2);
    const otherEventsToDisplay = content.events.slice(2);

    return (
        <div className="infoBlock" id="eventsBlock" ref={eventsRef}>
            <div className="eventMainCard">
                <div className="robomaster">
                    <h2 className="sectionTitle">Our Events</h2>
                    <p className="robomasterDesc">
                        We have two primary events that we attend each year.
                    </p>
                    <p className="robomasterDesc">
                        <strong>RoboMaster North America (RMNA)</strong> is the premier collegiate robotics competition in the region, bringing together top university teams to design, build, and battle advanced robots in esports-style matches. Inspired by DJI’s global RoboMaster competition in China, RMNA showcases cutting-edge engineering, teamwork, and strategy on an international stage. Each year, the event pushes students to combine mechanical design, computer vision, embedded systems, and AI to compete in high-energy matches that blend robotics with the thrill of competitive gaming.
                    </p>
                    <p className="robomasterDesc">
                        The <strong>Midwest RoboMaster Regional</strong> serves as a key qualifier and community hub for universities across the central United States. Known for its collaborative spirit and fierce competition, the Midwest event provides new and veteran teams alike the opportunity to test their robots, refine strategies, and gain valuable match experience before the North America championship. More than just a stepping stone, it has become a showcase of innovation and creativity, highlighting the technical talent and dedication of Midwest engineering programs.
                    </p>
                    <a className="moreAboutLink" href="https://aruw.org/what-is-robomaster" alt="More About Robomasters">
                        <span>More About Robomasters</span>
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                    </a>
                </div>

                <div className="eventsContent">
                    <div className="topEvents">
                        {eventsToDisplay.map((event, index) => (
                            <div className="eventInfo" key={index}>
                                <div className="eventImage">
                                    <img src={loadImage('events', event.image)} alt={event.name} className="eventPhoto" />
                                    <span>{event.date}</span>
                                </div>
                                <h5>{event.name}</h5>
                                <div className="eventLocationContent">
                                    <img src={locationIcon} alt="Location Icon" className="locationIcon" />
                                    <p>{event.location}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="otherEvents">
                        {otherEventsToDisplay.map((event, index) => (
                            <div className="otherEventInfo" key={index}>
                                <img src={loadImage('events', event.image)} alt={event.name} className="otherEventPhoto" />
                                <div className="otherEventText">
                                    <h5>{event.name}</h5>
                                    <div className="otherEventLocation">
                                        <img src={locationIcon} alt="Location Icon" className="miniIcon" />
                                        <p>{event.location}</p>
                                    </div>
                                    <div className="otherEventDate">
                                        <img src={calendarIcon} alt="Calendar Icon" className="miniIcon" />
                                        <p>{event.date}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
