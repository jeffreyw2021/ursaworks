import { render, screen, fireEvent } from '@testing-library/react';
import Cursor from '../Cursor';

// setupTests.js stubs matchMedia to always report matches: false, so the
// component is disabled unless a test opts in. Returns a restore function.
function mockPointer({ fine, reducedMotion = false }) {
    const original = window.matchMedia;
    window.matchMedia = (query) => ({
        matches: query.includes('pointer: fine') ? fine : reducedMotion,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
    });
    return () => {
        window.matchMedia = original;
    };
}

test('renders nothing on a coarse pointer', () => {
    const restore = mockPointer({ fine: false });
    const { container } = render(<Cursor />);
    expect(container).toBeEmptyDOMElement();
    restore();
});

test('renders the dot and the ring on a fine pointer', () => {
    const restore = mockPointer({ fine: true });
    render(<Cursor />);
    expect(screen.getByTestId('cursor-dot')).toBeInTheDocument();
    expect(screen.getByTestId('cursor-ring')).toBeInTheDocument();
    restore();
});

test('hides the native cursor only while mounted on a fine pointer', () => {
    const restore = mockPointer({ fine: true });
    const { unmount } = render(<Cursor />);
    expect(document.documentElement).toHaveClass('cursorHidden');
    unmount();
    expect(document.documentElement).not.toHaveClass('cursorHidden');
    restore();
});

test('never hides the native cursor on a coarse pointer', () => {
    const restore = mockPointer({ fine: false });
    render(<Cursor />);
    expect(document.documentElement).not.toHaveClass('cursorHidden');
    restore();
});

test('moves the dot to the pointer position', () => {
    const restore = mockPointer({ fine: true });
    const frames = [];
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
        frames.push(cb);
        return frames.length;
    });

    render(<Cursor />);
    fireEvent.mouseMove(document, { clientX: 120, clientY: 80 });
    frames[0](); // run one animation frame by hand

    expect(screen.getByTestId('cursor-dot')).toHaveStyle({
        transform: 'translate3d(120px, 80px, 0)',
    });

    window.requestAnimationFrame.mockRestore();
    restore();
});

test('grows the ring while an interactive element is hovered', () => {
    const restore = mockPointer({ fine: true });
    render(
        <>
            <Cursor />
            <a href="/about">About</a>
            <p>plain text</p>
        </>
    );

    fireEvent.mouseOver(screen.getByRole('link', { name: 'About' }));
    expect(screen.getByTestId('cursor-ring')).toHaveClass('isHovering');

    fireEvent.mouseOut(screen.getByRole('link', { name: 'About' }));
    expect(screen.getByTestId('cursor-ring')).not.toHaveClass('isHovering');
    restore();
});

test('ignores hover over non-interactive elements', () => {
    const restore = mockPointer({ fine: true });
    render(
        <>
            <Cursor />
            <p>plain text</p>
        </>
    );

    fireEvent.mouseOver(screen.getByText('plain text'));
    expect(screen.getByTestId('cursor-ring')).not.toHaveClass('isHovering');
    restore();
});

test('marks the cursor as clicking between mousedown and mouseup', () => {
    const restore = mockPointer({ fine: true });
    render(<Cursor />);

    fireEvent.mouseDown(document);
    expect(screen.getByTestId('cursor-dot')).toHaveClass('isClicking');

    fireEvent.mouseUp(document);
    expect(screen.getByTestId('cursor-dot')).not.toHaveClass('isClicking');
    restore();
});

test('hides the cursor when the pointer leaves the window', () => {
    const restore = mockPointer({ fine: true });
    render(<Cursor />);

    fireEvent.mouseLeave(document);
    expect(screen.getByTestId('cursor-dot')).toHaveClass('isOffscreen');

    fireEvent.mouseEnter(document);
    expect(screen.getByTestId('cursor-dot')).not.toHaveClass('isOffscreen');
    restore();
});
