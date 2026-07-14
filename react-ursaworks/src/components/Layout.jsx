import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import '../styles/dashboardStyle.css';
import '../styles/bgAnimationStyle.css';

export default function Layout() {
    return (
        <div className="container">
            <Navbar />

            <div className="content">
                <Outlet />
                <Footer />
            </div>

            <div className="bgAnimation">
                <div className="bgAnimationGrid" />
            </div>
        </div>
    );
}