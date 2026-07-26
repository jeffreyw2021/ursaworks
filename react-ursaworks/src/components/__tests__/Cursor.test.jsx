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
