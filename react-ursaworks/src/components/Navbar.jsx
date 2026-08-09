import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import headerLogo from '../assets/logoItems/headerLogo.svg';
import '../styles/navbarStyle.css';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navbarRef = useRef(null);
    const closeMenu = () => setIsMenuOpen(false);
    const navigationItems = [
        { label: 'ABOUT', to: '/about' },
        { label: 'EVENTS', to: '/events' },
        { label: 'ROBOTS', to: '/robots' },
        { label: 'CONTACT', to: '/contact' },
        {
            label: 'JOIN US',
            href: 'https://docs.google.com/forms/d/e/1FAIpQLSeLZA5S6mubtBZEqAkaxPZ_qtcPbZ42d1Mc69lE729pCAPCBQ/viewform?usp=dialog',
            target: '_blank',
            rel: 'noopener noreferrer',
        },
    ];

    useEffect(() => {
        const handleMouseDown = (event) => {
            if (navbarRef.current && !navbarRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <nav className="header" ref={navbarRef}>
            <Link to="/" className="headerLogoContainer">
                <img src={headerLogo} className="headerLogo" alt="Header Logo" />
            </Link>
            <button
                id="mobile-navigation-toggle"
                className="mobileMenuToggle"
                type="button"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-navigation-menu"
                aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                onClick={() => setIsMenuOpen((open) => !open)}
            >
                <span aria-hidden="true" />
                <span aria-hidden="true" />
                <span aria-hidden="true" />
            </button>
            <div className="right">
                {navigationItems.map((item) => (
                    item.to ? (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) => `headerLink ${isActive ? 'active' : ''}`}
                            onClick={closeMenu}
                        >
                            {item.label}
                        </NavLink>
                    ) : (
                        <a
                            key={item.href}
                            className="JoinusLink"
                            href={item.href}
                            target={item.target}
                            rel={item.rel}
                            onClick={closeMenu}
                        >
                            {item.label}
                        </a>
                    )
                ))}
            </div>
            <div
                id="mobile-navigation-menu"
                className={`mobileNavigation ${isMenuOpen ? 'open' : ''}`}
                data-testid="mobile-menu"
            >
                {navigationItems.map((item) => (
                    item.to ? (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) => `headerLink ${isActive ? 'active' : ''}`}
                            onClick={closeMenu}
                        >
                            {item.label}
                        </NavLink>
                    ) : (
                        <a
                            key={item.href}
                            className="JoinusLink"
                            href={item.href}
                            target={item.target}
                            rel={item.rel}
                            onClick={closeMenu}
                        >
                            {item.label}
                        </a>
                    )
                ))}
            </div>
        </nav>
    );
}
