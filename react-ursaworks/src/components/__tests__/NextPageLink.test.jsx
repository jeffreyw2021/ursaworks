import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import About from '../About';
import Event from '../Event';
import Robots from '../Robots';
import Contact from '../Contact';

// Each content page hands off to the next one, so a visitor is never left at
// a dead end. Contact is the end of the chain and deliberately has no link.
const CHAIN = [
    ['about', About, '/events'],
    ['events', Event, '/robots'],
    ['robots', Robots, '/contact'],
];

test.each(CHAIN)('the %s page links on to %s', (_page, Page, destination) => {
    render(<Page />, { wrapper: MemoryRouter });
    const links = screen.getAllByRole('link').filter((link) => link.className.includes('nextPageLink'));
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute('href', destination);
});

test('the contact page ends the chain', () => {
    render(<Contact />, { wrapper: MemoryRouter });
    const links = screen.getAllByRole('link').filter((link) => link.className.includes('nextPageLink'));
    expect(links).toHaveLength(0);
});
