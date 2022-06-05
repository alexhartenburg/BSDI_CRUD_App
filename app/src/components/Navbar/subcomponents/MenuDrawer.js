import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
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
import LogoutIcon from '@mui/icons-material/Logout';
import FeedIcon from '@mui/icons-material/Feed';

const MenuDrawer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerState, setDrawerState] = useState(false);
  const [user, setUser] = useContext(UserContext)

  const toggleDrawer = (open) => (event) => {
    setDrawerState(open);
  };
  const handleNewPost = async () => {
    if(location.pathname === '/' || location.pathname === '/allposts'){
      document.getElementById('newPost').click();
    }else{
      await navigate('/');
      document.getElementById('newPost').click();
    }
  }

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
                  {user.id
                  ?
                  <>
                  <ListItem disablePadding onClick={() => document.getElementById('loginButton').click()}>
                    <ListItemButton aria-label="All Posts">
                    <ListItemIcon>
                      <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Log Out" />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                  <ListItem disablePadding onClick={() => navigate('/')}>
                    <ListItemButton aria-label="All Posts">
                    <ListItemIcon>
                      <FeedIcon />
                    </ListItemIcon>
                    <ListItemText primary="My Posts" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding onClick={() => navigate('/allposts')}>
                    <ListItemButton aria-label="All Posts">
                    <ListItemIcon>
                      <FeedIcon />
                    </ListItemIcon>
                    <ListItemText primary="All Posts" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding onClick={handleNewPost}>
                    <ListItemButton aria-label="All Posts">
                    <ListItemIcon>
                      <FeedIcon />
                    </ListItemIcon>
                    <ListItemText primary="New Post" />
                    </ListItemButton>
                  </ListItem>
                  </>
                  :
                  <>
                  <ListItem disablePadding onClick={() => document.getElementById('loginButton').click()}>
                    <ListItemButton aria-label="All Posts">
                    <ListItemIcon>
                      <LoginIcon />
                    </ListItemIcon>
                    <ListItemText primary="Log In" />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                  <ListItem disablePadding onClick={() => navigate('/')}>
                    <ListItemButton aria-label="All Posts">
                    <ListItemIcon>
                      <FeedIcon />
                    </ListItemIcon>
                    <ListItemText primary="All Posts" />
                    </ListItemButton>
                  </ListItem>
                  </>
                  }
                </List>
                </Box>
          </Drawer>
    </div>
  );
}

export default MenuDrawer;