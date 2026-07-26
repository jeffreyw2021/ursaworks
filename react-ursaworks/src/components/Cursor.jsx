import { useEffect, useRef, useState } from 'react';
import '../styles/cursorStyle.css';

// Fraction of the remaining distance the ring covers each frame. Lower trails
// longer. 1 means no lag at all, which is what reduced motion asks for.
const RING_EASING = 0.18;

export default function Cursor() {
    const [enabled, setEnabled] = useState(false);
    const dotRef = useRef(null);
    const ringRef = useRef(null);

    // Only mice and trackpads get a custom cursor. Touch devices keep their
    // native behavior and never lose the pointer.
    useEffect(() => {
        const query = window.matchMedia('(pointer: fine)');
        const sync = () => setEnabled(query.matches);
        sync();
        query.addEventListener('change', sync);
        return () => query.removeEventListener('change', sync);
    }, []);

    useEffect(() => {
        if (!enabled) return undefined;
        document.documentElement.classList.add('cursorHidden');
        return () => document.documentElement.classList.remove('cursorHidden');
    }, [enabled]);

    useEffect(() => {
        if (!enabled) return undefined;

        const target = { x: 0, y: 0 };
        const ringPos = { x: 0, y: 0 };
        const ease = window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 1
            : RING_EASING;
        let frame;

        const move = (e) => {
            target.x = e.clientX;
            target.y = e.clientY;
        };

        const draw = () => {
            ringPos.x += (target.x - ringPos.x) * ease;
            ringPos.y += (target.y - ringPos.y) * ease;
            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
            }
            if (ringRef.current) {
                ringRef.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
            }
            frame = window.requestAnimationFrame(draw);
        };

        document.addEventListener('mousemove', move);
        frame = window.requestAnimationFrame(draw);

        return () => {
            document.removeEventListener('mousemove', move);
            window.cancelAnimationFrame(frame);
        };
    }, [enabled]);

    if (!enabled) return null;

    return (
        <>
            <div className="cursorRing" data-testid="cursor-ring" ref={ringRef}>
                <span className="cursorRingShape" />
            </div>
            <div className="cursorDot" data-testid="cursor-dot" ref={dotRef}>
                <span className="cursorDotShape" />
            </div>
        </>
    );
}
