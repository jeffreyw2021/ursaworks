import React from 'react';
import emailIcon from '../assets/logoItems/emailIcon.svg';
import insIcon from '../assets/logoItems/insIcon.svg';
import completeLogo from '../assets/logoItems/completeLogo.svg';
import '../styles/footerStyle.css';

export default function Footer() {
    return (
        <footer>
            <div className="footerContent">
                <p>© 2024 - WashU Ursaworks Robomaster Club</p>
                <div className="footerLink">
                    <img src={emailIcon} alt="Email" />
                    <a href="mailto:ursaworksrobotics@gmail.com">ursaworksrobotics@gmail.com</a>
                </div>
                <div className="footerLink">
                    <img src={insIcon} alt="Instagram" />
                    <a href="https://www.instagram.com/ursaworks.robotics/">ursaworks.robotics</a>
                </div>
            </div>
            <img src={completeLogo} className="completeLogo" />
        </footer>
    );
}
