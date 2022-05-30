import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuDrawer from './subcomponents/MenuDrawer';

const Navbar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
            <Toolbar>
                <MenuDrawer />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Blog
                </Typography>
                <Button color="inherit">Login</Button>
            </Toolbar>
        </AppBar>
    </Box>
  );
}

export default Navbar;