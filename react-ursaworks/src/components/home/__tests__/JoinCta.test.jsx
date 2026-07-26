import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import JoinCta from '../JoinCta';

test('renders the join call-to-action linking to the contact page', () => {
    render(<JoinCta />, { wrapper: MemoryRouter });
    expect(screen.getByText('Join Ursaworks')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /get in touch/i })).toHaveAttribute(
        'href',
        '/contact'
    );
});
