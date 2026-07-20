import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EventTeaser from '../EventTeaser';
import content from '../../../content.json';

test('renders the latest event with a link to /events', () => {
    render(<EventTeaser />, { wrapper: MemoryRouter });
    const latest = content.events[0];
    expect(screen.getByText(latest.name)).toBeInTheDocument();
    expect(screen.getByText(latest.location)).toBeInTheDocument();
    expect(screen.getByText(latest.date)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /see all events/i })).toHaveAttribute('href', '/events');
});

test('renders nothing when there are no events', () => {
    const { container } = render(<EventTeaser events={[]} />, { wrapper: MemoryRouter });
    expect(container).toBeEmptyDOMElement();
});
