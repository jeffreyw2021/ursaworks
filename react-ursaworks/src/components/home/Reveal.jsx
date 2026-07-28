import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Fraction of the element — or of the viewport, for elements taller than it —
// that must be on screen before the reveal fires.
const VISIBLE_FRACTION = 0.3;

// True unless the element can be positively measured as off screen. Anything we
// cannot measure counts as visible: content is never worth hiding on the
// strength of a reading we do not trust.
function isInView(element) {
    const rect = element.getBoundingClientRect();
    const viewport = window.innerHeight;
    if (!viewport || !rect.height) return true;

    const onScreen = Math.min(rect.bottom, viewport) - Math.max(rect.top, 0);
    // Clamping against the viewport matters for sections taller than the
    // screen, which can never show 30% of themselves at once.
    return onScreen >= Math.min(rect.height, viewport) * VISIBLE_FRACTION;
}

// Shared scroll-reveal wrapper: fades/slides children up the first time they
// enter the viewport. `delay` (seconds) staggers sibling reveals.
//
// This deliberately measures the viewport itself rather than using
// framer-motion's `whileInView`. That routes every Reveal on the page through
// one shared IntersectionObserver, and on some Windows browsers it stopped
// reporting after the first element: every section below it stayed at opacity 0
// and the site read as blank, on every route, until reload. Doing our own
// measurement keeps the worst case at "no animation" instead of "no content".
export default function Reveal({ children, delay = 0, className }) {
    const reducedMotion = useReducedMotion();
    const elementRef = useRef(null);
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        if (revealed) return undefined;

        const element = elementRef.current;
        if (!element) {
            setRevealed(true);
            return undefined;
        }

        let frame = 0;
        const check = () => {
            frame = 0;
            if (isInView(element)) setRevealed(true);
        };
        // Coalesce to one measurement per frame: scroll fires far faster than
        // the page can paint, and getBoundingClientRect forces layout.
        const schedule = () => {
            if (!frame) frame = window.requestAnimationFrame(check);
        };

        check();

        // Scroll events do not bubble, and the app scrolls inside .container
        // rather than the window (see dashboardStyle.css), so listen on the
        // capture phase to catch scrolling from any container.
        document.addEventListener('scroll', schedule, { capture: true, passive: true });
        window.addEventListener('resize', schedule);

        return () => {
            if (frame) window.cancelAnimationFrame(frame);
            document.removeEventListener('scroll', schedule, { capture: true });
            window.removeEventListener('resize', schedule);
        };
    }, [revealed]);

    return (
        <motion.div
            ref={elementRef}
            className={className}
            initial="hidden"
            animate={revealed ? 'visible' : 'hidden'}
            variants={{
                hidden: reducedMotion ? { opacity: 0 } : { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 20, delay }}
        >
            {children}
        </motion.div>
    );
}
