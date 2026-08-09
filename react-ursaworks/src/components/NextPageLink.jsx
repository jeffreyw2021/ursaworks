import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import '../styles/nextPageStyle.css';

// Bottom-of-page hand-off, so each content page leads somewhere instead of
// dead-ending. Carries the same gradient-pill language as the homepage
// teaser links and the events page's "More About ARC".
export default function NextPageLink({ to, label }) {
    return (
        <Link className="nextPageLink" to={to}>
            <span>{label}</span>
            <FontAwesomeIcon icon={faArrowRight} />
        </Link>
    );
}
