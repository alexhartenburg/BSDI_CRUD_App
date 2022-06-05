import { useContext } from "react";
import { AllPostsContext } from "../../pages/context/AllPostsContext";
import { UserContext } from "../../context/UserContext";
import PostCard from "./subcomponents/PostCard";
import NewPostCard from "./subcomponents/NewPostCard";

const PostList = () => {
    const [posts, setPosts] = useContext(AllPostsContext);
    const [user, setUser] = useContext(UserContext);
    return(
        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            {user.id ? <NewPostCard /> : ""}
            {
                posts.map((post, i) => {
                    return(<PostCard post={post} key={i} />)
                })
            }
        </div>
    )
}

export default PostList;