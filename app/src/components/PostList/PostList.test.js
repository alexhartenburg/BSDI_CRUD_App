import { fireEvent, getByRole, render, screen } from '@testing-library/react';
import PostList from './PostList';
import { AllPostsContext } from '../../pages/context/AllPostsContext'

describe('PostList', () => {
    beforeEach(() => {
        const posts = [
            {
                title: "Help Help, I'm being repressed!",
                content: "There's some lovely content down here.",
                author: "Dennis's Mother"
            },
            {
                title: "One, Two, Five!",
                content: "Three, Sir.",
                author: "John Clease"
            }
        ]
        render(
            <AllPostsContext.Provider value={posts}>
                <PostList />
            </AllPostsContext.Provider>
        );
    })
    test('renders two cards', () => {
        expect(screen.getByText("Help Help, I'm being repressed!")).toBeInTheDocument();
        expect(screen.getByText("One, Two, Five!")).toBeInTheDocument();
        expect(screen.getByText("There's some lovely content down here.")).toBeInTheDocument();
        expect(screen.getByText("Three, Sir.")).toBeInTheDocument();
        expect(screen.getByText("Dennis's Mother")).toBeInTheDocument();
        expect(screen.getByText("John Clease")).toBeInTheDocument();
        expect(screen.getAllByRole('button', {name: /Read More/i}).length).toBe(2);
    })
})