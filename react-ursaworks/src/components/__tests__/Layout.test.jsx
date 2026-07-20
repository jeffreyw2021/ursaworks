import { render, screen } from '@testing-library/react';
import { useContext, useEffect, useState } from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Layout from '../Layout';
import ScrollContainerContext from '../../configs/ScrollContainerContext';

// Reads the provided ref after mount (refs are only populated post-commit).
function Probe() {
    const containerRef = useContext(ScrollContainerContext);
    const [cls, setCls] = useState('');
    useEffect(() => {
        setCls(containerRef.current?.className ?? '');
    }, [containerRef]);
    return <p data-testid="probe">{cls}</p>;
}

test('Layout provides a ref to the scrolling .container div', () => {
    render(
        <MemoryRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route index element={<Probe />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );
    expect(screen.getByTestId('probe')).toHaveTextContent('container');
});
