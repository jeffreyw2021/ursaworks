import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Reveal from './Reveal';
import '../../styles/homeStyle.css';

export default function JoinCta() {
    return (
        <section className="homeSection joinCta">
            <Reveal className="joinCtaInner">
                <h2 className="sectionTitle">Join Ursaworks</h2>
                <p className="joinCtaText">
                    All WashU students are welcome — no experience required.
                </p>
                <Link className="teaserLink" to="/contact">
                    <span>Get In Touch</span>
                    <FontAwesomeIcon icon={faArrowRight} />
                </Link>
            </Reveal>
        </section>
    );
}
