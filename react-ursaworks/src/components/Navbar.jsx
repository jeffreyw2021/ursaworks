import React from 'react';
import headerLogo from '../assets/logoItems/headerLogo.svg';
import '../styles/navbarStyle.css';

export default function Navbar({ activeTab }) {
    return (
        <nav className="header">
            <button className="headerLogoContainer">
                <img src={headerLogo} className="headerLogo" alt="Header Logo" />
            </button>
            <div className="right">
                {['about', 'events'].map((id) => (
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
                    href="https://docs.google.com/forms/d/e/1FAIpQLSdA6wetVhaKAaOyRvP9hzwuNKt1eTfAjNX4nF_CTLxj_yEvfw/viewform"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    JOIN US
                </a>
            </div>
        </nav>
    );
}
