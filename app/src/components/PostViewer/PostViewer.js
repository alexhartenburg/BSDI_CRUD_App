import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { Button, Switch, TextField } from '@mui/material';
import DeletePost from "../DeletePost/DeletePost";
import config from "../../config";

const apiUrl = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;

const PostViewer = (props) => {
    const [user, setUser] = useContext(UserContext)
    const [edit, setEdit] = useState(false);
    const [post, setPost] = useState({});
    const [titleError, setTitleError] = useState(false);
    const [titleErrorText, setTitleErrorText] = useState('');
    const [contentError, setContentError] = useState(false);
    const [contentErrorText, setContentErrorText] = useState('');
    const { id } = useParams()
    useEffect(() => {
        fetch(`${apiURL}post/${id}`)
            .then(res => {
                if(res.status === 200){
                    return(res.json());
                }else{
                    return({})
                }
            })
            .then(data => setPost(data))
            .catch(err => console.error(err))
    }, [])

    const handleEdit = () => {
        setEdit(!edit);
    }
    
    const handleSubmit = () => {
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        let error = false;
        if(title === ''){
            setTitleError(true);
            setTitleErrorText('Required')
            error = true;
        }else{
            setTitleError(false);
            setTitleErrorText('')
        }
        if(content === ''){
            setContentError(true);
            setContentErrorText('Required')
            error = true;
        }else{
            setContentError(false);
            setContentErrorText('')
        }
        if(!error){
            let token =  document.cookie.split(";").find((element) => element.includes("crud_app_user")).split('=')[1];
            let options = {
                method: "PUT",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `bearer ${token}`,
                },
                body: JSON.stringify({
                    id: post.id,
                    title: title,
                    content: content,
                }),
            };
            
            fetch(`${apiUrl}post`, options)
                .then(res => {
                    if(res.status === 200){
                        return res.json();
                    }
                })
                .then(data => {
                    setPost(data);
                    setEdit(false);
                })
                .catch(err => console.error(err))
        }
    }

    let title = '';
    let paragraphs = [];
    let author = '';
    let created = '';
    if(post.id){
        title = post.title;
        paragraphs = post.content.split('\n');
        author = `${post.firstName} ${post.lastName}`;
        const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const date = post.created_at.split('T')[0];
        const time = post.created_at.split('T')[1].split('.')[0];
        created = `Created: ${date.split('-')[2]} ${months[parseInt(date.split('-')[1])]}, ${date.split('-')[0]} at ${time}`;
    }
    if(edit){
        return(
            <div style={{paddingLeft:'15px', paddingRight:'15px'}}>
                <div>
                    <Switch id='editPost' checked={edit} onChange={handleEdit}/>
                    Edit Post
                    <DeletePost postID={post.id}/>
                </div>
                <div>
                    <TextField 
                        id='title'
                        defaultValue={title} 
                        inputProps={{style: {fontSize:'32px', fontWeight:600}}} 
                    />
                </div>
                <div>
                    <TextField 
                        id='content'
                        defaultValue={post.content}
                        sx={{width: "100%"}}
                        inputProps={{style: {fontSize:'16px', fontWeight:400, lineHeight:'18px'}}}
                        multiline
                        rows={Math.floor(window.innerHeight * 0.5 / 18)}
                    />
                </div>
                <Button variant="contained" onClick={handleSubmit}>Submit Changes</Button>
            </div>
        )
    }else{
        return(
            <div style={{paddingLeft:'15px', paddingRight:'15px'}}>
                {user.hasOwnProperty('id') && user.id === post.user_id
                ? 
                <><Switch id='editPost' checked={edit} onChange={handleEdit} />Edit Post</>
                :
                ""
                }
                <p style={{fontSize:'32px', fontWeight:600, marginTop:'15px', marginLeft: '15px'}}>{title}</p>
                {paragraphs.map((paragraph, i) => <p key={i} style={{fontSize:'16px', fontWeight:400, marginLeft:'15px', minHeight:'13px', margin:'3px 0 3px 0'}}> {paragraph}</p>)}
                <br />
                <p style={{marginLeft:'15px'}}>{author}</p>
                <p style={{marginLeft:'15px'}}>{created}</p>
            </div>
        )
    }
}

export default PostViewer;