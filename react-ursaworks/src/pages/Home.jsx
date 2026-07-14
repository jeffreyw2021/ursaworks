import React, { useState, useRef, useEffect } from 'react';
import Hero from '../components/Hero';

export default function Home() {
    const [heroOpacity, setHeroOpacity] = useState(0);
    const heroRef = useRef(null);

    useEffect(() => {
        const currentHeroRef = heroRef.current;
        const observer = new IntersectionObserver(
            ([entry]) => {
                setHeroOpacity(entry.intersectionRatio);
            },
            { threshold: Array.from({ length: 11 }, (_, i) => i * 0.1) }
        );

        if (currentHeroRef) observer.observe(currentHeroRef);

        return () => {
            if (currentHeroRef) observer.unobserve(currentHeroRef);
        };
    }, []);

    return (
        <>
            <div style={{ opacity: heroOpacity }}>
                <Hero />
            </div>
            <div id="hero" ref={heroRef} />
        </>
    );
}