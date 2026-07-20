import { render, screen } from '@testing-library/react';
import Reveal from './Reveal';

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
