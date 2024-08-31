import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import '../styles/dashboardStyle.css';
import headerLogo from '../assets/logoItems/headerLogo.svg';
import BearBg from '../assets/logoItems/BearBg.svg';
import stars from '../assets/logoItems/stars.svg';
import content from '../json/content.json';
import locationIcon from '../assets/logoItems/locationIcon.svg';
import calendarIcon from '../assets/logoItems/calendarIcon.svg';
import emailIcon from '../assets/logoItems/emailIcon.svg';
import insIcon from '../assets/logoItems/insIcon.svg';
import completeLogo from '../assets/logoItems/completeLogo.svg';
import loadImage from '../configs/loadImages';

export default function Dashboard() {
    const [activeLink, setActiveLink] = useState('about');

    // Refs for sections
    const aboutRef = useRef(null);
    const eventsRef = useRef(null);
    const teamsRef = useRef(null);

    const handleLinkClick = (id) => {
        setActiveLink(id);
        const section = document.getElementById(`${id}Block`);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Set up Intersection Observer
    useEffect(() => {
        const sections = [
            { id: 'about', ref: aboutRef },
            { id: 'events', ref: eventsRef },
            { id: 'team', ref: teamsRef },
        ];

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveLink(entry.target.id.replace('Block', ''));
                }
            });
        }, observerOptions);

        sections.forEach((section) => {
            if (section.ref.current) {
                observer.observe(section.ref.current);
            }
        });

        return () => {
            sections.forEach((section) => {
                if (section.ref.current) {
                    observer.unobserve(section.ref.current);
                }
            });
        };
    }, []);

    const eventsToDisplay = content.events.slice(0, 2);
    const otherEventsToDisplay = content.events.slice(2);

    return (
        <div className="container">
            <nav className="header">
                <img src={headerLogo} className="headerLogo" alt="Header Logo" />
                <div className="right">
                    <a
                        className={`headerLink ${activeLink === 'about' ? 'active' : ''}`}
                        alt="About link"
                        id="about"
                        onClick={() => handleLinkClick('about')}
                        href="#aboutBlock"
                    >
                        ABOUT
                    </a>
                    <a
                        className={`headerLink ${activeLink === 'events' ? 'active' : ''}`}
                        alt="Event link"
                        id="events"
                        onClick={() => handleLinkClick('events')}
                        href="#eventsBlock"
                    >
                        EVENTS
                    </a>
                    <a
                        className={`headerLink ${activeLink === 'team' ? 'active' : ''}`}
                        alt="Team link"
                        id="team"
                        onClick={() => handleLinkClick('team')}
                        href="#teamBlock"
                    >
                        TEAM
                    </a>
                    <a
                        className="JoinusLink"
                        href="https://ursaworks.larksuite.com/share/base/form/shrusDP9YdSlPynRzednBPM0s9P"
                        alt="Join Us"
                    >
                        JOIN US
                    </a>
                </div>
            </nav>

            <div className="content">
                <div className="headerPlaceholder hidden" aria-hidden>
                    <p className="JoinusLink hidden" aria-hidden>
                        ursaworks
                    </p>
                </div>
                <div className="hero">
                    <img src={BearBg} className="heroBg" alt="Background" />
                    <div className="heroContent">
                        <img src={stars} className="stars" alt="Stars" />
                        <h1 className="title">ROBOMASTERS</h1>
                        <h2 className="subtitle">From Washington University in St.Louis</h2>
                    </div>
                </div>
                <div className="infoBlock" id="aboutBlock" ref={aboutRef}>
                    <div className="divider">
                        <hr />
                        <h3>OUR MISSION</h3>
                        <hr />
                    </div>
                    <p className="intro">{content.intro}</p>
                    <h4>OUR ROBOTS</h4>
                    <p className="robotsContent">{content.ourRobot}</p>
                    <div className="robots">
                        {content.robots.map((robot, index) => (
                            <div
                                className="robotInfo"
                                key={index}
                                style={{
                                    display: 'flex',
                                    flexDirection: index % 2 === 0 ? 'row' : 'row-reverse',
                                }}
                            >
                                <div className="robotImg">
                                    <img src={loadImage('robots', robot.image)} alt={robot.name} />
                                </div>
                                <div className="robotText">
                                    <h5>{robot.name}</h5>
                                    <p>{robot.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="infoBlock" id="eventsBlock" ref={eventsRef}>
                    <div className="divider">
                        <hr />
                        <h3>OUR EVENTS</h3>
                        <hr />
                    </div>
                    <p className="eventsIntro">
                        The <strong style={{ color: '#fff' }}>RoboMaster University Championship</strong> is an annual global robotics contest with 200+ universities. Hosted by DJI, it empowers students to showcase skills and push boundaries. Robots in a grand arena tackle challenges, controlled by operators using onboard cameras. Matches involve disarming opponents' robots and bases, calculating damage through pressure-sensitive plates from launched projectiles. The event applies classroom-taught skills in computer vision, embedded systems, and mechanical design practically.
                    </p>
                    <a className="moreAboutLink" href="https://aruw.org/what-is-robomaster" alt="More About Robomasters">
                        <span>More About Robomasters</span>
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                    </a>
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
                <div className="infoBlock" id="teamBlock" ref={teamsRef}>
                    <div className="divider">
                        <hr />
                        <h3>OUR TEAM</h3>
                        <hr />
                    </div>
                    <div className="teamContent">
                        {content.team.map((team, index) => (
                            <div className="teamMember" key={index}>
                                <img src={loadImage('members', team.image)} alt={team.name} />
                                <h5>{team.name}</h5>
                                <p>{team.position}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <footer>
                <div className="footerContent">
                    <p>© 2024 - WashU Ursaworks Robomaster Club</p>
                    <div className="footerLink">
                        <img src={emailIcon} alt="Email" />
                        <a href="mailto:ursaworksrobotics@gmail.com" title="Ursaworks email">
                            ursaworksrobotics@gmail.com
                        </a>
                    </div>
                    <div className="footerLink">
                        <img src={insIcon} alt="Instagram" />
                        <a href="https://www.instagram.com/ursaworks.robotics/reels/?locale=en-US" alt="Ursaworks instagram">
                            ursaworks.robotics
                        </a>
                    </div>
                </div>
                <img src={completeLogo} className="completeLogo" />
            </footer>
        </div>
    );
}
