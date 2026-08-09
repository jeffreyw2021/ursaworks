import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RobotsTeaser from '../RobotsTeaser';
import content from '../../../content.json';

test('renders every robot name and a link to /robots', () => {
    render(<RobotsTeaser />, { wrapper: MemoryRouter });
    for (const robot of content.robots) {
        expect(screen.getByText(robot.name)).toBeInTheDocument();
    }
    expect(screen.getByRole('link', { name: /meet all the robots/i })).toHaveAttribute('href', '/robots');
});

test('shows only the first sentence of each description', () => {
    render(<RobotsTeaser />, { wrapper: MemoryRouter });
    // Full descriptions belong to /robots. The teaser carries the opening
    // sentence only, so nothing past the first paragraph may appear here.
    for (const robot of content.robots) {
        const [opening, ...rest] = robot.description;
        const end = opening.indexOf('. ');
        const firstSentence = end === -1 ? opening : opening.slice(0, end + 1);

        expect(screen.getByText(firstSentence)).toBeInTheDocument();
        if (firstSentence !== opening) {
            expect(screen.queryByText(opening)).not.toBeInTheDocument();
        }
        for (const paragraph of rest) {
            expect(screen.queryByText(paragraph)).not.toBeInTheDocument();
        }
    }
});
