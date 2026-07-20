import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Shared scroll-reveal wrapper: fades/slides children up the first time they
// enter the viewport. `delay` (seconds) staggers sibling reveals.
export default function Reveal({ children, delay = 0, className }) {
    const reducedMotion = useReducedMotion();

    return (
        <motion.div
            className={className}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 40 }}
            whileInView={{
                opacity: 1,
                y: 0,
                transition: { type: 'spring', stiffness: 100, damping: 20, delay },
            }}
            viewport={{ once: true, amount: 0.3 }}
        >
            {children}
        </motion.div>
    );
}
