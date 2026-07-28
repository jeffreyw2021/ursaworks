import { act, render, screen } from '@testing-library/react';
import Reveal from '../Reveal';

// The setupTests IntersectionObserver stub never invokes its callback, which is
// exactly the condition that blanked the site for Windows users: the reveal was
// never triggered, so every section stayed at opacity 0 forever. Content must
// survive that, otherwise a single unreliable browser API takes the page down.
test('becomes visible even when the reveal never triggers', async () => {
    const { container } = render(
        <Reveal className="probeClass">
            <p>content that must not stay hidden</p>
        </Reveal>
    );

    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
    });

    expect(container.querySelector('.probeClass').style.opacity).not.toBe('0');
});

test('renders its children', () => {
    render(
        <Reveal>
            <p>hello from inside</p>
        </Reveal>
    );
    expect(screen.getByText('hello from inside')).toBeInTheDocument();
});

test('passes className through to the wrapper element', () => {
    const { container } = render(
        <Reveal className="probeClass">
            <p>hi</p>
        </Reveal>
    );
    expect(container.querySelector('.probeClass')).toBeInTheDocument();
});
