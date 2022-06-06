import { useState, useContext } from 'react';
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import Register from '../Register/Register';
import { UserContext } from '../../context/UserContext';

const apiURL = process.env.APU_URL || 'http://localhost:4000/';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 250,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
};

const Login = () => {
  const [open, setOpen] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [usernameErrorText, setUsernameErrorText] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorText, setPasswordErrorText] = useState('');
  const [formErrorText, setFormErrorText] = useState('');
  const navigate = useNavigate();
  const handleOpen = () => {
      if(user.id){
        removeCookie("crud_app_user");
        setUser({});
        navigate('/');
      }else{
        setOpen(true);
      }
  }
  const handleClose = () => {
      setFormErrorText('');
      setOpen(false);
  }

  const [user, setUser] = useContext(UserContext)
  const [cookies, setCookie, removeCookie] = useCookies(["name"]);
  const handleLogin = (e) => {
    e.preventDefault();
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let error = false;
    let regexUsername = /^[a-zA-Z0-9\-_]+$/;
    if(username === ''){
        setUsernameError(true);
        setUsernameErrorText('Required');
        setFormErrorText('');
        error = true;
    }else if(!username.match(regexUsername)){
        setUsernameError(true);
        setUsernameErrorText('A-Z, a-z, -, _');
        setFormErrorText('');
        error = true;
    }else{
        setUsernameError(false);
        setUsernameErrorText('');
    }
    if(password === ''){
        setPasswordError(true);
        setPasswordErrorText('Required');
        setFormErrorText('');
        error = true;
    }else{
        setPasswordError(false);
        setPasswordErrorText('');
    }
    if(!error){
        let options = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: username,
              password: password,
            }),
        }
        fetch(`${apiURL}login`, options)
            .then(res => {
                if(res.status === 200){
                    return(res.json())
                }else if(res.status === 400){
                    setFormErrorText('Incorrect username or password');
                    return false;
                }
            })
            .then(data => {
                if(data){
                    let payloadString = atob(data.token.split(".")[1]).replaceAll("[", "").replaceAll("]", "");
                    let payloadData = JSON.parse(payloadString);
                    setFormErrorText('')
                    setCookie("crud_app_user", data.token);
                    setUser({
                        id: payloadData.id,
                        firstName: payloadData.first_name,
                        lastName: payloadData.last_name,
                    });
                    handleClose();
                    navigate('/');
                }
            })
            .catch(err => console.error(err.status))
    }
  }

  return (
    <div>
      <Button onClick={handleOpen} sx={{color: 'white'}} id='loginButton'>{user.id ? "LOGOUT" : "LOGIN"}</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableRestoreFocus
      >
        <Box sx={style}>
            <form style={{textAlign: 'center'}} onSubmit={e => handleLogin(e)}>
                <div>
                    <TextField id="username" label="Username" variant="standard" error={usernameError} helperText={usernameErrorText} />
                </div>
                <div>
                    <TextField id="password" label="Password" variant="standard" type="password" error={passwordError} helperText={passwordErrorText} />
                </div>
                <Typography style={{fontSize:'12px'}} color="error" >{formErrorText}</Typography>
                <Button type="submit">Submit</Button>
            </form>
            <Register />
        </Box>
      </Modal>
    </div>
  );
}

export default Login;