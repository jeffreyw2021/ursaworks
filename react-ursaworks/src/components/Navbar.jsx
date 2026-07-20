import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import headerLogo from '../assets/logoItems/headerLogo.svg';
import '../styles/navbarStyle.css';

export default function Navbar() {
    return (
        <nav className="header">
            <Link to="/" className="headerLogoContainer">
                <img src={headerLogo} className="headerLogo" alt="Header Logo" />
            </Link>
            <div className="right">
                {[['about', 'ABOUT'], ['events', 'EVENTS'], ['robots', 'ROBOTS']].map(([path, label]) => (
                    <NavLink
                        key={path}
                        to={`/${path}`}
                        className={({ isActive }) => `headerLink ${isActive ? 'active' : ''}`}
                    >
                        {label}
                    </NavLink>
                ))}
                <a
                    className="JoinusLink"
                    href="https://docs.google.com/forms/d/e/1FAIpQLSeLZA5S6mubtBZEqAkaxPZ_qtcPbZ42d1Mc69lE729pCAPCBQ/viewform?usp=dialog"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    JOIN US
                </a>
            </div>
        </nav>
    );
}