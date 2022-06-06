import { useState } from 'react';
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import config from "../../config";

const apiUrl = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;

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

const Register = () => {
    const [open, setOpen] = useState(false);
    const [firstNameError, setFirstNameError] = useState(false);
    const [firstNameErrorText, setFirstNameErrorText] = useState('');
    const [lastNameError, setLastNameError] = useState(false);
    const [lastNameErrorText, setLastNameErrorText] = useState('');
    const [usernameError, setUsernameError] = useState(false);
    const [usernameErrorText, setUsernameErrorText] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorText, setPasswordErrorText] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [confirmPasswordErrorText, setConfirmPasswordErrorText] = useState(false);
    const [formErrorText, setFormErrorText] = useState('')

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setFirstNameError(false);
        setLastNameError(false);
        setUsernameError(false);
        setPasswordError(false);
        setConfirmPasswordError(false);
        setFormErrorText('')
        setOpen(false);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let firstName = document.getElementById('regFirstName').value;
        let lastName = document.getElementById('regLastName').value;
        let username = document.getElementById('regUsername').value;
        let password = document.getElementById('regPassword').value;
        let confirmPassword = document.getElementById('regConfirmPassword').value;

        const regexFirstName = /^[a-zA-Z\s\-]+$/;
        const regexLastName = /^[a-zA-Z\s\-]+$/;
        const regexUsername = /^[a-zA-Z0-9\-_]+$/;

        let error = false;
        if(firstName === ''){
            setFirstNameError(true);
            setFirstNameErrorText('Required');
            setFormErrorText('');
            error = true;
        }else if(!firstName.match(regexFirstName)){
            setFirstNameError(true);
            setFirstNameErrorText('A-Z, a-z, -, space');
            setFormErrorText('');
            error = true;
        }else{
            setFirstNameError(false);
            setFirstNameErrorText('');
        }
        if(lastName === ''){
            setLastNameError(true);
            setLastNameErrorText('Required');
            setFormErrorText('');
            error = true;
        }else if(!lastName.match(regexLastName)){
            setLastNameError(true);
            setLastNameErrorText('A-Z, a-z, -, space');
            setFormErrorText('');
            error = true;
        }else{
            setLastNameError(false);
            setLastNameErrorText('');
        }
        if(username === ''){
            setUsernameError(true);
            setUsernameErrorText('Required');
            setFormErrorText('');
            error = true;
        }else if(!username.match(regexUsername)){
            setUsernameError(true);
            setUsernameErrorText('A-Z, a-z, 0-9, -, _');
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
        }else if(password.length < 8){
            setPasswordError(true);
            setPasswordErrorText('Min 8 Characters');
            setFormErrorText('');
            error = true;
        }else if(password.length > 20){
            setPasswordError(true);
            setPasswordErrorText('Max 20 Characters');
            setFormErrorText('');
            error = true;
        }else{
            setPasswordError(false);
            setPasswordErrorText('');
        }
        if(confirmPassword === ''){
            setConfirmPasswordError(true);
            setConfirmPasswordErrorText('Required');
            setFormErrorText('');
            error = true;
        }else if(confirmPassword !== password){
            
        }else{
            setConfirmPasswordError(false);
            setConfirmPasswordErrorText('');
        }
        if(!error){
            let options = {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    username: username,
                    password: password,
                }),
            }
            fetch(`${apiURL}register`, options)
                .then(res => {
                    if(res.status === 201){
                        return(res.json())
                    }else if(res.status === 409){
                        setFormErrorText('Username is already in use');
                        return false;
                    }
                })
                .then(data => {
                    if(data){
                        handleClose();
                    }
                })
                .catch(err => console.error(err.status))
        }
    }

    return (
        <div>
            <Button onClick={handleOpen}>Create New Account</Button>
            <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            disableRestoreFocus
            >
            <Box sx={style}>
                <form style={{textAlign: 'center'}} onSubmit={e => handleSubmit(e)}>
                    <div>
                        <TextField id="regFirstName" label="First Name" variant="standard" error={firstNameError} helperText={firstNameErrorText} />
                    </div>
                    <div>
                        <TextField id="regLastName" label="lastName" variant="standard" error={lastNameError} helperText={lastNameErrorText} />
                    </div>
                    <div>
                        <TextField id="regUsername" label="Username" variant="standard" error={usernameError} helperText={usernameErrorText} />
                    </div>
                    <br/>
                    <div>
                        <TextField id="regPassword" label="Password" variant="standard" type="password" error={passwordError} helperText={passwordErrorText} />
                    </div>
                    <div>
                        <TextField id="regConfirmPassword" label="Confirm Password" variant="standard" type="password" error={confirmPasswordError} helperText={confirmPasswordErrorText} />
                    </div>
                    <Typography style={{fontSize:'12px'}} color="error" >{formErrorText}</Typography>
                    <Button type="submit">Submit</Button>
                </form>
                
            </Box>
            </Modal>
        </div>
    );
}

export default Register;