import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Event from '../components/Event';
// import Team from '../components/Team';
import Footer from '../components/Footer';
import '../styles/dashboardStyle.css';
import '../styles/bgAnimationStyle.css';

export default function Main() {
    const [activeTab, setActiveTab] = useState('about');
    const [heroOpacity, setHeroOpacity] = useState(0);

    // References for sections
    const heroRef = useRef(null);
    const aboutRef = useRef(null);
    const eventsRef = useRef(null);
    // const teamsRef = useRef(null);

    // Observe Hero Section for opacity effect
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setHeroOpacity(entry.intersectionRatio);
            },
            { threshold: Array.from({ length: 11 }, (_, i) => i * 0.1) }
        );

        if (heroRef.current) observer.observe(heroRef.current);

        return () => {
            if (heroRef.current) observer.unobserve(heroRef.current);
        };
    }, []);

    // Observe Sections for the most visible one
    useEffect(() => {
        const sections = [
            { id: 'about', ref: aboutRef },
            { id: 'events', ref: eventsRef }
            // { id: 'team', ref: teamsRef }
        ];

        const observer = new IntersectionObserver(
            (entries) => {
                let maxVisible = { id: null, ratio: 0 };

                entries.forEach((entry) => {
                    if (entry.intersectionRatio > maxVisible.ratio) {
                        maxVisible = { id: entry.target.id, ratio: entry.intersectionRatio };
                    }
                });

                if (maxVisible.id) setActiveTab(maxVisible.id);
            },
            { threshold: [0.2, 0.4, 0.6, 0.8, 1.0], rootMargin: '0px 0px -50% 0px' } // Adjust rootMargin if needed
        );

        sections.forEach(({ ref }) => {
            if (ref.current) observer.observe(ref.current);
        });

        return () => {
            sections.forEach(({ ref }) => {
                if (ref.current) observer.unobserve(ref.current);
            });
        };
    }, []);

    return (
        <div className="container">
            <Navbar activeTab={activeTab} />

            <div style={{ opacity: heroOpacity }}>
                <Hero />
            </div>

            <div className="content">
                <div id="hero" ref={heroRef} />
                <div id="about" ref={aboutRef}><About /></div>
                <div id="events" ref={eventsRef}><Event /></div>
                {/* <div id="team" ref={teamsRef}><Team /></div> */}
                <Footer />
            </div>

            <div className="bgAnimation" />
        </div>
    );
}
