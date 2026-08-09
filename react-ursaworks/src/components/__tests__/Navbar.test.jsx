import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../Navbar';

function renderNavbar() {
    return render(
        <MemoryRouter initialEntries={['/']}>
            <Navbar />
        </MemoryRouter>
    );
}

test('mobile menu starts closed and opens with all primary destinations', () => {
    renderNavbar();
    const toggle = screen.getByRole('button', { name: /open navigation menu/i });

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'ABOUT' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'EVENTS' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'ROBOTS' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'CONTACT' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'JOIN US' })).toHaveAttribute('target', '_blank');
});

test('selecting an internal destination closes the mobile menu', () => {
    renderNavbar();
    const toggle = screen.getByRole('button', { name: /open navigation menu/i });
    fireEvent.click(toggle);
    fireEvent.click(screen.getByRole('link', { name: 'CONTACT' }));

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
});
