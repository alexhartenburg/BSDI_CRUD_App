import { useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuDrawer from './subcomponents/MenuDrawer';
import Login from '../Login/Login';
import { UserContext } from '../../context/UserContext';

const Navbar = () => {
  const [user, setUser] = useContext(UserContext);
  return (
    <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
            <Toolbar>
                <MenuDrawer />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
                    {user.id ? `${user.firstName}'s BLOG` : 'BLOG'}
                </Typography>
                <Login />
            </Toolbar>
        </AppBar>
    </Box>
  );
}

export default Navbar;