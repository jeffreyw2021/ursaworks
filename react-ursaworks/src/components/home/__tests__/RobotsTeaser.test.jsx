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
    const { container } = render(<RobotsTeaser />, { wrapper: MemoryRouter });
    // Full descriptions belong to /robots. Asserted as properties of what the
    // teaser rendered rather than by re-deriving the slice — repeating the
    // component's own cut would make this agree with a wrong cut.
    const rendered = [...container.querySelectorAll('.teaserRobotText p')].map((p) => p.textContent);
    expect(rendered).toHaveLength(content.robots.length);

    rendered.forEach((sentence, index) => {
        const [opening, ...rest] = content.robots[index].description;

        expect(opening.startsWith(sentence)).toBe(true);
        expect(sentence).toMatch(/\.$/);
        // A second sentence would have started after the period-space.
        expect(sentence).not.toMatch(/\. /);
        for (const paragraph of rest) {
            expect(screen.queryByText(paragraph)).not.toBeInTheDocument();
        }
    });
});
