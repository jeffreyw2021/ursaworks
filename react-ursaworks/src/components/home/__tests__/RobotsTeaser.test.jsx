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
    // Full multi-sentence descriptions belong to /robots, not the teaser.
    expect(screen.queryByText(content.robots[0].description)).not.toBeInTheDocument();
    const firstSentence = content.robots[0].description.slice(
        0,
        content.robots[0].description.indexOf('. ') + 1
    );
    expect(screen.getByText(firstSentence)).toBeInTheDocument();
});
