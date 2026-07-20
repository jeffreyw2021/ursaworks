import { render, screen } from '@testing-library/react';
import JoinCta from './JoinCta';

test('renders the join call-to-action with a mailto link', () => {
    render(<JoinCta />);
    expect(screen.getByText('Join Ursaworks')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /get in touch/i })).toHaveAttribute(
        'href',
        'mailto:ursaworksrobotics@gmail.com'
    );
});
