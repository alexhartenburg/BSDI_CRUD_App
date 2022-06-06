import { useEffect, useState, useContext } from 'react';
import { AllPostsContext } from './context/AllPostsContext';
import { UserContext } from '../context/UserContext';
import PostList from '../components/PostList/PostList';
import config from "../config";

const apiUrl = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;


const Posts = (props) => {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useContext(UserContext)
    useEffect(() => fetchPosts(), [])
    useEffect(() => fetchPosts(), [props.posts])
    useEffect(() => fetchPosts(), [user])
    const fetchPosts = () => {
        let options;
        let url;
        if(props.posts === 'user'){
            let token =  document.cookie.split(";").find((element) => element.includes("crud_app_user")).split('=')[1]
            options = {
                method: "GET",
                mode: "cors",
                headers: {
                  "Content-Type": "application/json",
                  "authorization": `bearer ${token}`,
                },
            };
            url = `${apiURL}posts/${user.id}`;
        }else if(props.posts === 'all'){
            options = {};
            url = `${apiURL}posts`;
        }
        fetch(url, options)
            .then(res => {
                if(res.status === 200){
                    return res.json();
                }
            })
            .then(data => setPosts(data))
            .catch(err => console.error(err))
    }
    return(
        <AllPostsContext.Provider value={[posts, setPosts]}>
            <PostList />
        </AllPostsContext.Provider>
    );
}

export default Posts;