import { fireEvent, getByRole, render, screen } from '@testing-library/react';
import PostCard from '../PostCard';

describe('PostCard', () => {
    beforeEach(() => {
        const post = {
            title: "Help Help, I'm being repressed!",
            content: "There's some lovely content down here.",
            author: "Dennis's Mother"
        }
        render(<PostCard post={post} />);
    })
    test('renders a heading', () => {
        expect(screen.getByText("Help Help, I'm being repressed!")).toBeInTheDocument();
    })
    test('renders the content', () => {
        expect(screen.getByText("There's some lovely content down here.")).toBeInTheDocument();
    })
    test('renders a heading', () => {
        expect(screen.getByText("Dennis's Mother")).toBeInTheDocument();
    })
    test('renders a "read more" button', () => {
        expect(screen.getByRole('button', {name: /Read More/i})).toBeInTheDocument();
    })
})