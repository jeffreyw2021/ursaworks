import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Event from '../Event';
import content from '../../content.json';

test('renders a result line only for events that have one', () => {
    const { container } = render(<Event />, { wrapper: MemoryRouter });
    const withResult = content.events.filter((event) => event.result);

    // Guards the test itself: if no entry has a result, the assertions below
    // would pass vacuously.
    expect(withResult.length).toBeGreaterThan(0);

    for (const event of withResult) {
        expect(screen.getByText(event.result)).toBeInTheDocument();
    }
    expect(container.querySelectorAll('.eventResult')).toHaveLength(withResult.length);
});

test('shows the events intro below the stats', () => {
    const { container } = render(<Event />, { wrapper: MemoryRouter });
    const intro = container.querySelector('.robomasterDesc');
    const stats = container.querySelector('.eventStats');

    // DOCUMENT_POSITION_PRECEDING (2) set means stats comes before intro.
    expect(intro.compareDocumentPosition(stats) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy();
});

test('labels the outbound link for ARC', () => {
    render(<Event />, { wrapper: MemoryRouter });
    expect(screen.getByRole('link', { name: /more about arc/i })).toBeInTheDocument();
});
