import { render, screen } from '@testing-library/react';
import About from '../About';
import content from '../../content.json';

test('renders the What Is ARC section', () => {
    render(<About />);
    expect(screen.getByRole('heading', { name: content.arc.title })).toBeInTheDocument();
    for (const paragraph of content.arc.description) {
        expect(screen.getByText(paragraph)).toBeInTheDocument();
    }
});

test('still renders the mission alongside it', () => {
    render(<About />);
    expect(screen.getByRole('heading', { name: /our mission/i })).toBeInTheDocument();
    for (const paragraph of content.intro) {
        expect(screen.getByText(paragraph)).toBeInTheDocument();
    }
});

test('leads with the ARC section, then the mission', () => {
    render(<About />);
    const arc = screen.getByRole('heading', { name: content.arc.title });
    const mission = screen.getByRole('heading', { name: /our mission/i });
    expect(arc.compareDocumentPosition(mission) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});
