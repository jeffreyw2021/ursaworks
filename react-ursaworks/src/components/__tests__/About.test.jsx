import { render, screen } from '@testing-library/react';
import About from '../About';
import content from '../../content.json';

test('renders the What Is ARC section', () => {
    render(<About />);
    expect(screen.getByRole('heading', { name: content.arc.title })).toBeInTheDocument();
    expect(screen.getByText(content.arc.description)).toBeInTheDocument();
});

test('still renders the mission alongside it', () => {
    render(<About />);
    expect(screen.getByRole('heading', { name: /our mission/i })).toBeInTheDocument();
    expect(screen.getByText(content.intro)).toBeInTheDocument();
});
