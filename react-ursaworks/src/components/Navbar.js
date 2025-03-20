import React from 'react';
import headerLogo from '../assets/logoItems/headerLogo.svg';
import '../styles/navbarStyle.css';

export default function Navbar({ activeLink, handleLinkClick }) {
    const handleScroll = (id) => {
        handleLinkClick(id); // Update active link state

        const section = document.getElementById(`${id}Block`);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <nav className="header">
            <img src={headerLogo} className="headerLogo" alt="Header Logo" />
            <div className="right">
                {['about', 'events', 'team'].map((id) => (
                    <a
                        key={id}
                        className={`headerLink ${activeLink === id ? 'active' : ''}`}
                        onClick={(e) => {
                            e.preventDefault(); // Prevent default anchor behavior
                            handleScroll(id);
                        }}
                        style={{ cursor: 'pointer' }} // Ensure it's clickable
                    >
                        {id.toUpperCase()}
                    </a>
                ))}
                <a
                    className="JoinusLink"
                    href="https://ursaworks.larksuite.com/share/base/form/shrusDP9YdSlPynRzednBPM0s9P"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    JOIN US
                </a>
            </div>
        </nav>
    );
}
