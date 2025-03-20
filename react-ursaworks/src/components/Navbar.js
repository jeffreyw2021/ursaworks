import React from 'react';
import headerLogo from '../assets/logoItems/headerLogo.svg';
import '../styles/navbarStyle.css';

export default function Navbar({ activeTab }) {
    return (
        <nav className="header">
            <img src={headerLogo} className="headerLogo" alt="Header Logo" />
            <div className="right">
                {['about', 'events', 'team'].map((id) => (
                    <a
                        key={id}
                        className={`headerLink ${activeTab === id ? 'active' : ''}`}
                        href={`#${id}`}
                        style={{ cursor: 'pointer' }}
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
