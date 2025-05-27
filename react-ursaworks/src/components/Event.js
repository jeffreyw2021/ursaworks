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
                        The <strong>RoboMaster University Championship</strong> is an annual global robotics contest with 200+ universities. Hosted by DJI, it empowers students to showcase skills and push boundaries. Robots in a grand arena tackle challenges, controlled by operators using onboard cameras. Matches involve disarming opponents' robots and bases, calculating damage through pressure-sensitive plates from launched projectiles. The event applies classroom-taught skills in computer vision, embedded systems, and mechanical design practically.
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
