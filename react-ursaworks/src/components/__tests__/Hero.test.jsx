import { render, screen } from '@testing-library/react';
import { useRef } from 'react';
import Hero from '../Hero';
import ScrollContainerContext from '../../configs/ScrollContainerContext';

// Hero reads the scroll container from context (Layout provides it in the app).
function Harness() {
    const ref = useRef(null);
    return (
        <ScrollContainerContext.Provider value={ref}>
            <div ref={ref} style={{ overflowY: 'scroll' }}>
                <Hero />
            </div>
        </ScrollContainerContext.Provider>
    );
}

test('renders the logo, wordmark, subtitle, and scroll hint', () => {
    const { container } = render(<Harness />);
    expect(screen.getByAltText('Stars')).toBeInTheDocument();
    expect(screen.getByText('URSAWORKS')).toBeInTheDocument();
    expect(screen.getByText('AT WASHINGTON UNIVERSITY IN ST. LOUIS')).toBeInTheDocument();
    expect(container.querySelector('.scrollHint')).toBeInTheDocument();
    expect(container.querySelector('.hero')).toHaveStyle({ pointerEvents: 'none' });
});
