import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Event from '../components/Event';
import Team from '../components/Team';
import Footer from '../components/Footer';
import '../styles/dashboardStyle.css';
import '../styles/bgAnimationStyle.css';

export default function Dashboard() {
    const [activeLink, setActiveLink] = useState('about');
    const [heroOpacity, setHeroOpacity] = useState(0);
    const aboutRef = useRef(null);
    const heroRef = useRef(null);
    const eventsRef = useRef(null);
    const teamsRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setHeroOpacity(entry.intersectionRatio);
            },
            { threshold: Array.from({ length: 11 }, (_, i) => i * 0.1) }
        );

        if (heroRef.current) {
            observer.observe(heroRef.current);
        }

        return () => {
            if (heroRef.current) {
                observer.unobserve(heroRef.current);
            }
        };
    }, []);

    return (
        <div className="container">
            <Navbar activeLink={activeLink} handleLinkClick={setActiveLink} />

            <div style={{ opacity: heroOpacity }}>
                <Hero />
            </div>

            <div className="content">
                <div id="hero" ref={heroRef} />
                <About aboutRef={aboutRef} />
                <Event eventsRef={eventsRef} />
                <Team teamsRef={teamsRef} />
                <Footer />
            </div>

            {/* <div className="bgAnimationCover" /> */}
            <div className="bgAnimation" />
        </div>
    );
}
