import { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LoginIcon from '@mui/icons-material/Login';
import FeedIcon from '@mui/icons-material/Feed';

const MenuDrawer = () => {
  const [drawerState, setDrawerState] = useState(false);

  const toggleDrawer = (open) => (event) => {
    setDrawerState(open);
  };

  return (
    <div>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            anchor='left'
            open={drawerState}
            onClose={toggleDrawer(false)}
          >
            <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
                >
                <List>
                    <ListItem disablePadding>
                        <ListItemButton aria-label="Log In">
                        <ListItemIcon>
                            <LoginIcon />
                        </ListItemIcon>
                        <ListItemText primary="Log In" />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem disablePadding>
                        <ListItemButton aria-label="All Posts">
                        <ListItemIcon>
                            <FeedIcon />
                        </ListItemIcon>
                        <ListItemText primary="All Posts" />
                        </ListItemButton>
                    </ListItem>
                </List>
                </Box>
          </Drawer>
    </div>
  );
}

export default MenuDrawer;