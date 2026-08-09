import { fireEvent, render, screen, within } from '@testing-library/react';
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
    const mobileMenu = screen.getByTestId('mobile-menu');

    expect(within(mobileMenu).getByRole('link', { name: 'ABOUT' })).toBeVisible();
    expect(within(mobileMenu).getByRole('link', { name: 'EVENTS' })).toBeVisible();
    expect(within(mobileMenu).getByRole('link', { name: 'ROBOTS' })).toBeVisible();
    expect(within(mobileMenu).getByRole('link', { name: 'CONTACT' })).toBeVisible();

    const joinUsLink = within(mobileMenu).getByRole('link', { name: 'JOIN US' });
    expect(joinUsLink).toHaveAttribute(
        'href',
        'https://docs.google.com/forms/d/e/1FAIpQLSeLZA5S6mubtBZEqAkaxPZ_qtcPbZ42d1Mc69lE729pCAPCBQ/viewform?usp=dialog'
    );
    expect(joinUsLink).toHaveAttribute('target', '_blank');
    expect(joinUsLink).toHaveAttribute('rel', 'noopener noreferrer');
});

test('selecting an internal destination closes the mobile menu', () => {
    renderNavbar();
    const toggle = screen.getByRole('button', { name: /open navigation menu/i });
    fireEvent.click(toggle);
    fireEvent.click(within(screen.getByTestId('mobile-menu')).getByRole('link', { name: 'CONTACT' }));

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('Escape closes the mobile menu and restores focus to the toggle', () => {
    renderNavbar();
    const toggle = screen.getByRole('button', { name: /open navigation menu/i });
    fireEvent.click(toggle);

    const contactLink = within(screen.getByTestId('mobile-menu')).getByRole('link', { name: 'CONTACT' });
    contactLink.focus();
    fireEvent.keyDown(contactLink, { key: 'Escape' });

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(document.activeElement).toBe(toggle);
});
