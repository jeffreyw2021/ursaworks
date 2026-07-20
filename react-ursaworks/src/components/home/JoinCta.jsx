import React from 'react';
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
                <a className="teaserLink" href="mailto:ursaworksrobotics@gmail.com">
                    <span>Get In Touch</span>
                    <FontAwesomeIcon icon={faArrowRight} />
                </a>
            </Reveal>
        </section>
    );
}
