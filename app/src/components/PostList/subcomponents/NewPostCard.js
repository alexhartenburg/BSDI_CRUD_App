import { useState, useContext } from 'react';
import { Box, Button, Card, CardContent, Modal, TextField, Typography } from '@mui/material';
import { UserContext } from '../../../context/UserContext';
import { AllPostsContext } from '../../../pages/context/AllPostsContext';
import '../css/postList.css';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "50%",
    minWidth: 250,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
};

const NewPostCard = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [titleError, setTitleError] = useState(false);
  const [titleErrorText, setTitleErrorText] = useState('');
  const [contentError, setContentError] = useState(false);
  const [contentErrorText, setContentErrorText] = useState('');

  const [user, setUser] = useContext(UserContext);
  const [posts, setPosts] = useContext(AllPostsContext);
  
  const handleSubmit = (e) => {
    e.preventDefault();
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
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "authorization": `bearer ${token}`,
            },
            body: JSON.stringify({
              title: title,
              content: content,
            }),
        };
        
        fetch('http://localhost:4000/post', options)
            .then(res => {
                if(res.status === 200){
                    return res.json();
                }
            })
            .then(data => {
                setPosts(data);
                handleClose();
            })
            .catch(err => console.error(err))
    }
  }

  return (
    <>
        <div id='newPost' style={{ minWidth: '300px', width: '60%', marginTop:'5px', cursor: 'pointer' }} onClick={handleOpen}>
            <Card variant="outlined">
                <CardContent id='newPostCard'>
                    <Typography sx={{textAlign:'center'}}>New Blog Post</Typography>
                </CardContent>
            </Card>
        </div>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            disableRestoreFocus
        >
            <Box sx={style}>
                <form style={{textAlign: 'center', width: '100%'}} onSubmit={e => handleSubmit(e)}>
                    <div>
                        <TextField 
                            id="title" 
                            label="Title" 
                            variant="standard" 
                            error={titleError}
                            helperText={titleErrorText}
                            fullWidth
                        />
                    </div>
                    <br />
                    <div>
                        <TextField
                            id="content"
                            label="Post"
                            multiline
                            rows={8}
                            error={contentError}
                            helperText={contentErrorText}
                            fullWidth
                        />
                    </div>
                    <Button type="submit">Submit</Button>
                </form>
            </Box>
        </Modal>
    </>
  );
}

export default NewPostCard;