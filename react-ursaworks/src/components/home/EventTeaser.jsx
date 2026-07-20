import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import content from '../../content.json';
import loadImage from '../../configs/loadImages';
import locationIcon from '../../assets/logoItems/locationIcon.svg';
import Reveal from './Reveal';
import '../../styles/homeStyle.css';

// `events` is injectable for testing; the first entry is the latest event.
export default function EventTeaser({ events = content.events }) {
    if (events.length === 0) return null;
    const latest = events[0];

    return (
        <section className="homeSection">
            <Reveal>
                <h2 className="sectionTitle">Latest Event</h2>
                <div className="teaserEvent">
                    <div className="teaserEventImage">
                        <img src={loadImage('events', latest.image)} alt={latest.name} />
                        <span className="teaserEventDate">{latest.date}</span>
                    </div>
                    <h3>{latest.name}</h3>
                    <div className="teaserEventLocation">
                        <img src={locationIcon} alt="" />
                        <p>{latest.location}</p>
                    </div>
                </div>
                <Link className="teaserLink" to="/events">
                    <span>See All Events</span>
                    <FontAwesomeIcon icon={faArrowRight} />
                </Link>
            </Reveal>
        </section>
    );
}
