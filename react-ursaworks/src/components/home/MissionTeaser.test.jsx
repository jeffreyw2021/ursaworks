import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MissionTeaser from './MissionTeaser';
import content from '../../content.json';

test('renders the mission title, intro text, and a link to /about', () => {
    render(<MissionTeaser />, { wrapper: MemoryRouter });
    expect(screen.getByText('Our Mission')).toBeInTheDocument();
    expect(screen.getByText(content.intro)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /more about us/i })).toHaveAttribute('href', '/about');
});
