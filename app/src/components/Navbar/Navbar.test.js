import { fireEvent, getByRole, render, screen } from '@testing-library/react';
import Navbar from './Navbar';

describe('Navbar', () => {
    beforeEach(() => {
        render(<Navbar />);
    })
    test('renders a menu icon on load', () => {
        expect(screen.getByRole('button', {name: /menu/i})).toBeInTheDocument();
    })
    test('renders a login button', () => {
        expect(screen.getByRole('button', {name: /login/i})).toBeInTheDocument();
    })
    test('renders the webpage name', () => {
        expect(screen.getByText('Blog')).toBeInTheDocument();
    })
})