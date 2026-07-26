import { render, screen, fireEvent } from '@testing-library/react';
import Cursor, { RING_EASING } from '../Cursor';

// setupTests.js stubs matchMedia to always report matches: false, so the
// component is disabled unless a test opts in. Installs the mock immediately
// and hands back nothing — restoration is handled centrally in afterEach so
// a failing assertion mid-test can never leave window.matchMedia (or a
// requestAnimationFrame spy) stubbed for the rest of the file.
let restoreMatchMedia;

function mockPointer({ fine, reducedMotion = false }) {
    const original = window.matchMedia;
    restoreMatchMedia = () => {
        window.matchMedia = original;
    };
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
}

afterEach(() => {
    if (restoreMatchMedia) restoreMatchMedia();
    restoreMatchMedia = undefined;
    vi.restoreAllMocks();
});

test('renders nothing on a coarse pointer', () => {
    mockPointer({ fine: false });
    const { container } = render(<Cursor />);
    expect(container).toBeEmptyDOMElement();
});

test('renders the dot and the ring on a fine pointer', () => {
    mockPointer({ fine: true });
    render(<Cursor />);
    expect(screen.getByTestId('cursor-dot')).toBeInTheDocument();
    expect(screen.getByTestId('cursor-ring')).toBeInTheDocument();
});

test('hides the native cursor only while mounted on a fine pointer', () => {
    mockPointer({ fine: true });
    const { unmount } = render(<Cursor />);
    expect(document.documentElement).toHaveClass('cursorHidden');
    unmount();
    expect(document.documentElement).not.toHaveClass('cursorHidden');
});

test('never hides the native cursor on a coarse pointer', () => {
    mockPointer({ fine: false });
    render(<Cursor />);
    expect(document.documentElement).not.toHaveClass('cursorHidden');
});

test('stays hidden until the first mousemove, then appears at that position', () => {
    mockPointer({ fine: true });
    const frames = [];
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
        frames.push(cb);
        return frames.length;
    });

    render(<Cursor />);
    // No mousemove yet — even after a frame runs, both wrappers must stay
    // hidden rather than showing a dot pinned to (0, 0).
    frames[0]();
    expect(screen.getByTestId('cursor-dot')).toHaveClass('isPending');
    expect(screen.getByTestId('cursor-ring')).toHaveClass('isPending');

    fireEvent.mouseMove(document, { clientX: 120, clientY: 80 });

    expect(screen.getByTestId('cursor-dot')).not.toHaveClass('isPending');
    expect(screen.getByTestId('cursor-ring')).not.toHaveClass('isPending');
});

test('moves the dot to the pointer position', () => {
    const frames = [];
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
        frames.push(cb);
        return frames.length;
    });
    mockPointer({ fine: true });

    render(<Cursor />);
    fireEvent.mouseMove(document, { clientX: 120, clientY: 80 });
    frames[0](); // run one animation frame by hand

    expect(screen.getByTestId('cursor-dot')).toHaveStyle({
        transform: 'translate3d(120px, 80px, 0)',
    });
});

test('trails the ring toward the pointer by RING_EASING, without sweeping in from the seed point', () => {
    const frames = [];
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
        frames.push(cb);
        return frames.length;
    });
    mockPointer({ fine: true });

    render(<Cursor />);
    // Seeds the ring at (100, 100) — no lag on this first event.
    fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });
    // Moves the target away from the seed. The ring doesn't follow until the
    // next animation frame runs.
    fireEvent.mouseMove(document, { clientX: 300, clientY: 200 });
    frames[0]();

    const expectedX = 100 + (300 - 100) * RING_EASING;
    const expectedY = 100 + (200 - 100) * RING_EASING;
    expect(screen.getByTestId('cursor-ring')).toHaveStyle({
        transform: `translate3d(${expectedX}px, ${expectedY}px, 0)`,
    });
    // The dot, unlike the ring, tracks exactly with no lag.
    expect(screen.getByTestId('cursor-dot')).toHaveStyle({
        transform: 'translate3d(300px, 200px, 0)',
    });
});

test('with reduced motion, the ring reaches the pointer in a single frame (no lag)', () => {
    const frames = [];
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
        frames.push(cb);
        return frames.length;
    });
    mockPointer({ fine: true, reducedMotion: true });

    render(<Cursor />);
    fireEvent.mouseMove(document, { clientX: 50, clientY: 60 }); // seeds the ring
    fireEvent.mouseMove(document, { clientX: 400, clientY: 300 });
    frames[0]();

    expect(screen.getByTestId('cursor-ring')).toHaveStyle({
        transform: 'translate3d(400px, 300px, 0)',
    });
});

test('grows the ring while an interactive element is hovered, and clears it on the transition away', () => {
    mockPointer({ fine: true });
    render(
        <>
            <Cursor />
            <a href="/about">About</a>
            <p>plain text</p>
        </>
    );

    fireEvent.mouseOver(screen.getByRole('link', { name: 'About' }));
    expect(screen.getByTestId('cursor-ring')).toHaveClass('isHovering');

    // The transition that matters: moving off the link and onto plain
    // content must clear the hover state (this is what a bare "ignores
    // hover over non-interactive elements" assertion, true even with zero
    // implementation, would miss).
    fireEvent.mouseOver(screen.getByText('plain text'));
    expect(screen.getByTestId('cursor-ring')).not.toHaveClass('isHovering');
});

test('ignores hover over non-interactive elements', () => {
    mockPointer({ fine: true });
    render(
        <>
            <Cursor />
            <p>plain text</p>
        </>
    );

    fireEvent.mouseOver(screen.getByText('plain text'));
    expect(screen.getByTestId('cursor-ring')).not.toHaveClass('isHovering');
});

test('marks the cursor as clicking between mousedown and mouseup', () => {
    mockPointer({ fine: true });
    render(<Cursor />);

    fireEvent.mouseDown(document);
    expect(screen.getByTestId('cursor-dot')).toHaveClass('isClicking');

    fireEvent.mouseUp(document);
    expect(screen.getByTestId('cursor-dot')).not.toHaveClass('isClicking');
});

test('releases a stuck click when the pointer leaves the window', () => {
    mockPointer({ fine: true });
    render(<Cursor />);

    fireEvent.mouseDown(document);
    expect(screen.getByTestId('cursor-dot')).toHaveClass('isClicking');

    // No mouseup reaches the document when the drag ends outside the
    // window (another tab/app). Leaving the window must release it anyway.
    fireEvent.mouseLeave(document);
    expect(screen.getByTestId('cursor-dot')).not.toHaveClass('isClicking');
});

test('releases a stuck click when the window loses focus', () => {
    mockPointer({ fine: true });
    render(<Cursor />);

    fireEvent.mouseDown(document);
    expect(screen.getByTestId('cursor-dot')).toHaveClass('isClicking');

    // Cmd-Tab away while holding the mouse button: no mouseup, just a blur.
    fireEvent(window, new Event('blur'));
    expect(screen.getByTestId('cursor-dot')).not.toHaveClass('isClicking');
});

test('hides the cursor when the pointer leaves the window', () => {
    mockPointer({ fine: true });
    render(<Cursor />);

    fireEvent.mouseLeave(document);
    expect(screen.getByTestId('cursor-dot')).toHaveClass('isOffscreen');

    fireEvent.mouseEnter(document);
    expect(screen.getByTestId('cursor-dot')).not.toHaveClass('isOffscreen');
});
