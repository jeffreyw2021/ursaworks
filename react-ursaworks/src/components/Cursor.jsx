import { useEffect, useRef, useState } from 'react';
import '../styles/cursorStyle.css';

// Fraction of the remaining distance the ring covers each frame. Lower trails
// longer. 1 means no lag at all, which is what reduced motion asks for.
export const RING_EASING = 0.18;

// Everything a user can click or type into. One delegated listener covers all
// of them, so no component has to opt in. Because `cursor: none` overrides
// the affordance rules on real interactive elements (navbarStyle.css:21,
// footerStyle.css:32), the ring's hover swell is the only remaining
// clickability signal on a fine pointer — any future clickable element (e.g.
// a `div` with an onClick) needs to be reachable by this selector, or it will
// silently show no hover affordance at all.
const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label';

export default function Cursor() {
    const [enabled, setEnabled] = useState(false);
    const [hovering, setHovering] = useState(false);
    const [clicking, setClicking] = useState(false);
    const [offscreen, setOffscreen] = useState(false);
    const [seen, setSeen] = useState(false);
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
        // Tracked as a ref (not the `seen` state) so `move` never goes stale
        // and this effect never has to re-subscribe on every mousemove.
        const seenRef = { current: false };
        const ease = window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 1
            : RING_EASING;
        let frame;

        const move = (e) => {
            if (!seenRef.current) {
                seenRef.current = true;
                // Seed the ring on the same event so it appears at the
                // pointer instead of sweeping in from the top-left corner.
                ringPos.x = e.clientX;
                ringPos.y = e.clientY;
                setSeen(true);
            }
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

    useEffect(() => {
        if (!enabled) return undefined;

        // `over` is the single source of truth for hover state: it fires for
        // every element the pointer enters, interactive or not, so it both
        // starts and clears the hover without needing a matching `mouseout`.
        // `closest` still keeps icon-to-label moves within the same link
        // hovering (it walks up to the same `<a>`), and — unlike a
        // `mouseout`-based approach — it self-heals on the next mouse move
        // if the hovered element is unmounted from under the pointer (e.g.
        // a route change on click).
        const over = (e) => setHovering(!!e.target.closest?.(INTERACTIVE));
        const down = () => setClicking(true);
        const up = () => setClicking(false);
        const leave = () => {
            setOffscreen(true);
            // A mouseup outside the window (drag onto another window/tab,
            // Cmd-Tab while holding) never reaches `document`. Treat leaving
            // the window as releasing the click too, so it can't latch.
            setClicking(false);
        };
        const enter = () => setOffscreen(false);

        document.addEventListener('mouseover', over);
        document.addEventListener('mousedown', down);
        document.addEventListener('mouseup', up);
        document.addEventListener('mouseleave', leave);
        document.addEventListener('mouseenter', enter);
        // Covers the same outside-mouseup case when focus itself leaves the
        // window (Cmd-Tab, clicking another app) without a mouseleave.
        window.addEventListener('blur', up);

        return () => {
            document.removeEventListener('mouseover', over);
            document.removeEventListener('mousedown', down);
            document.removeEventListener('mouseup', up);
            document.removeEventListener('mouseleave', leave);
            document.removeEventListener('mouseenter', enter);
            window.removeEventListener('blur', up);
        };
    }, [enabled]);

    if (!enabled) return null;

    const state = [
        hovering ? 'isHovering' : '',
        clicking ? 'isClicking' : '',
        offscreen ? 'isOffscreen' : '',
        // Present until the first real pointer position arrives, so the dot
        // never renders pinned to the (0, 0) default before any mousemove.
        seen ? '' : 'isPending',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <>
            <div
                className={`cursorRing ${state}`.trim()}
                data-testid="cursor-ring"
                ref={ringRef}
            >
                <span className="cursorRingShape" />
            </div>
            <div
                className={`cursorDot ${state}`.trim()}
                data-testid="cursor-dot"
                ref={dotRef}
            >
                <span className="cursorDotShape" />
            </div>
        </>
    );
}
