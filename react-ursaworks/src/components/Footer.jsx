import React from 'react';
import emailIcon from '../assets/logoItems/emailIcon.svg';
import insIcon from '../assets/logoItems/insIcon.svg';
import completeLogo from '../assets/logoItems/completeLogo.svg';
import '../styles/footerStyle.css';

export default function Footer() {
    const currentYear = new Date().getFullYear() || 2024;

    return (
        <footer>
            <div className="footerContent">
                <p>© {currentYear} - WashU Ursaworks Robomaster Club</p>
                <div className="footerLink">
                    <img src={emailIcon} alt="Email" />
                    <a href="mailto:ursaworksrobotics@gmail.com">ursaworksrobotics@gmail.com</a>
                </div>
                <div className="footerLink">
                    <img src={insIcon} alt="Instagram" />
                    <a href="https://www.instagram.com/washu.ursaworks/">washu.ursaworks</a>
                </div>
            </div>
            <img src={completeLogo} className="completeLogo" alt="Ursa Works Complete Logo" />
        </footer>
    );
}
