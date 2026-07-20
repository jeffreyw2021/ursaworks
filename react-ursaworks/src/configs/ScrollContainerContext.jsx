import { createContext } from 'react';

// Ref to the scrolling .container div. The app scrolls inside that div
// (overflow-y: scroll), not the window, so scroll-linked animation hooks
// need this ref as their container.
const ScrollContainerContext = createContext({ current: null });

export default ScrollContainerContext;
