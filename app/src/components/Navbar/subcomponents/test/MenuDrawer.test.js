import { Experimental_CssVarsProvider } from '@mui/material';
import { fireEvent, getByRole, render, screen } from '@testing-library/react';
import MenuDrawer from '../MenuDrawer';

describe('MenuDrawer', () => {
    beforeEach(() => {
        render(<MenuDrawer />);
    })
    test('renders a menu icon on load', () => {
        expect(screen.getByRole('button', {name: /menu/i})).toBeInTheDocument();
    })
    test('clicking the menu icon opens the drawer', () => {
        let menuButton = screen.getByRole('button', {name: /menu/i});
        fireEvent.click(menuButton);
        expect(screen.getByRole('button', {name: /All Posts/i})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /Log In/i})).toBeInTheDocument();
    })
})