import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Layout (and thus the scrollable .container) stays mounted across route
// changes, so its scroll position must be reset on each navigation.
export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // The app scrolls inside .container (overflow-y: scroll), not the window.
        const container = document.querySelector('.container');
        if (container) container.scrollTop = 0;
    }, [pathname]);

    return null;
}