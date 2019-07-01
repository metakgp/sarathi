import React, { useState, useEffect } from 'react';
import {AppBar, Toolbar, Link, Drawer, IconButton, List, ListItem, Badge} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu';
import useMediaQuery from '@material-ui/core/useMediaQuery';

function ListItemLink(props) {
  return (
    <ListItem>
      <Badge color='secondary' badgeContent={props.badgeCount}>
        <Link variant='h4' color='inherit' underline='none' style={{marginRight: 10}} href={props.href}>
          {props.children}
        </Link>
      </Badge>
    </ListItem>
  )
}


export default function NavigationBar() {
  
  const [open, setOpen] = useState(false)

  const closeDrawer = () => {
    setOpen(false);
  };

  const openDrawer = () => {
    setOpen(true);
  };

  const matches = useMediaQuery('(max-width: 768px)');
  
  useEffect(() => {
    // make api calls here to get badge counts
  }, []);
  
  return (
    <div style={{flexGrow: 1}}>
    <AppBar id='appBar'>
        <Toolbar>
          <Link variant='h4' color='inherit' underline='none' style={{flexGrow: 1}} href='/'>
            Travel KGP
          </Link>
          { matches ?
              <IconButton edge="start" color="inherit" aria-label="Menu" onClick={openDrawer}>
                <MenuIcon />
              </IconButton>
            :
              <div>
              <Badge color='secondary' badgeContent={1}>
                    <Link variant='button' color='inherit' underline='none' style={{marginRight: 10, marginLeft: 20}} href='/groups'>
                    Groups
                    </Link>
              </Badge>
              <Badge color='secondary' badgeContent={1}>
                  <Link variant='button' color='inherit' underline='none' style={{marginRight: 10, marginLeft: 20}} href='/requests'>
                  Requests
                  </Link>
              </Badge>
              <Badge color='secondary' badgeContent={1}>
                  <Link variant='button' color='inherit' underline='none' style={{marginRight: 10, marginLeft: 20}} href='/notifs'>
                  Notifications
                  </Link>
              </Badge>
              <Link variant='button' color='inherit' underline='none' style={{marginRight: 10, marginLeft: 20}} href='/logout'>
              Logout
              </Link>
              </div>
          }
        </Toolbar>
        { matches ?
        <Drawer
          anchor='right'
          open={open}
          onClose={closeDrawer}
        >
          <List>
            <ListItemLink href='\groups' badgeCount={1}>
              Groups
            </ListItemLink>
            <ListItemLink href='\requests' badgeCount={1}>
              Requests
            </ListItemLink>
            <ListItemLink href='\notifs' badgeCount={0}>
              Notifications
            </ListItemLink>
            <ListItemLink href='\logout' badgeCount={0}>
              Logout
            </ListItemLink>
          </List>
        </Drawer>
      :
        ''
    }
    </AppBar>
    </div>
  );
}