import { render, screen } from '@testing-library/react';
import Contact from '../Contact';
import content from '../../content.json';

test('renders contact links and leadership content', () => {
    render(<Contact />);

    expect(screen.getByRole('heading', { name: 'Contact Us' })).toBeInTheDocument();
    expect(screen.getByText('ARC Robotics Competition')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Leadership' })).toBeInTheDocument();

    content.contact.officers.forEach(({ name, email }) => {
        expect(screen.getByText(name)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: email })).toBeInTheDocument();
    });
});
