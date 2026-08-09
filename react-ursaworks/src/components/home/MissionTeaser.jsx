import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import content from '../../content.json';
import Paragraphs from '../Paragraphs';
import Reveal from './Reveal';
import '../../styles/homeStyle.css';

export default function MissionTeaser() {
    return (
        <section className="homeSection">
            <Reveal className="homeSectionInner">
                <h2 className="sectionTitle">Our Mission</h2>
                <Paragraphs className="missionIntro" text={content.intro} />
                <Link className="teaserLink" to="/about">
                    <span>More About Us</span>
                    <FontAwesomeIcon icon={faArrowRight} />
                </Link>
            </Reveal>
        </section>
    );
}
