import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import content from '../../content.json';
import Reveal from './Reveal';
import '../../styles/homeStyle.css';

export default function MissionTeaser() {
    return (
        <section className="homeSection">
            <Reveal>
                <h2 className="sectionTitle">Our Mission</h2>
                <p className="missionIntro">{content.intro}</p>
                <Link className="teaserLink" to="/about">
                    <span>More About Us</span>
                    <FontAwesomeIcon icon={faArrowRight} />
                </Link>
            </Reveal>
        </section>
    );
}
