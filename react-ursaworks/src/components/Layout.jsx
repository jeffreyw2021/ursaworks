import React, { useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Cursor from './Cursor';
import ScrollContainerContext from '../configs/ScrollContainerContext';
import '../styles/dashboardStyle.css';
import '../styles/bgAnimationStyle.css';

export default function Layout() {
    const containerRef = useRef(null);

    return (
        <ScrollContainerContext.Provider value={containerRef}>
            <div className="container" ref={containerRef}>
                <Cursor />
                <Navbar />

                <div className="content">
                    <Outlet />
                    <Footer />
                </div>

                <div className="bgAnimation">
                    <div className="bgAnimationGrid" />
                </div>
            </div>
        </ScrollContainerContext.Provider>
    );
}