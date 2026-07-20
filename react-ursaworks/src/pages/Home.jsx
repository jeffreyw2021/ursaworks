import React from 'react';
import Hero from '../components/Hero';
import MissionTeaser from '../components/home/MissionTeaser';
import RobotsTeaser from '../components/home/RobotsTeaser';
import EventTeaser from '../components/home/EventTeaser';
import JoinCta from '../components/home/JoinCta';
import '../styles/homeStyle.css';

export default function Home() {
    return (
        <>
            <Hero />
            <div className="heroSpacer" aria-hidden="true" />
            <MissionTeaser />
            <RobotsTeaser />
            <EventTeaser />
            <JoinCta />
        </>
    );
}
