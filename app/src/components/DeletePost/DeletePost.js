import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import config from "../config";

const apiUrl = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;

const DeletePost = (props) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleDelete = () => {
        let token =  document.cookie.split(";").find((element) => element.includes("crud_app_user")).split('=')[1];
        let options = {
            method: "DELETE",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "authorization": `bearer ${token}`,
            },
            body: JSON.stringify({
                id: props.postID
            }),
        };
        
        fetch(`${apiURL} post`, options)
            .then(res => {
                if(res.status === 200){
                    return true;
                }
            })
            .then(data => {
                navigate('/');
            })
            .catch(err => console.error(err))
    }

    return (
        <>
        <IconButton aria-label="delete" onClick={handleOpen} sx={{marginLeft:'10px'}}>
            <DeleteIcon />
        </IconButton>
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
            Confirm
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {`Are you sure you want to delete this post? This cannot be undone.`} 
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleDelete}>Yes</Button>
            <Button onClick={handleClose} autoFocus>No</Button>
            </DialogActions>
        </Dialog>
        </>
    );
}

export default DeletePost