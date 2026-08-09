import { render, screen } from '@testing-library/react';
import Contact from '../Contact';

test('renders contact links and leadership content', () => {
    render(<Contact />);

    expect(screen.getByRole('heading', { name: 'Contact Us' })).toBeInTheDocument();
    expect(screen.getByText('ARC Robotics Competition')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Leadership' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /@/ }).length).toBeGreaterThan(0);
});
