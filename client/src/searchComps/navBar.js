import React, { Component, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import {AppBar, Toolbar, Link, Grid, Drawer, IconButton, Button, List, ListItem} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu';
import useMediaQuery from '@material-ui/core/useMediaQuery';

function ListItemLink(props) {
  return (
    <ListItem>
      <Link variant='h4' color='inherit' underline='none' style={{marginRight: 10}} href={props.href}>
        {props.children}
      </Link>
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
                <Link variant='button' color='inherit' underline='none' style={{marginRight: 20}} href='/groups'>
                  Groups
                </Link>
                <Link variant='button' color='inherit' underline='none' style={{marginRight: 20}} href='/requests'>
                  Requests
                </Link>
                <Link variant='button' color='inherit' underline='none' style={{marginRight: 20}} href='/notifs'>
                  Notifications
                </Link>
                <Link variant='button' color='inherit' underline='none' style={{marginRight: 20}} href='/logout'>
                  Logout
                </Link>
              </div>
          }
        </Toolbar>
    </AppBar>
    { matches ?
        <Drawer
          anchor='right'
          open={open}
          onClose={closeDrawer}
        >
          <List>
            <ListItemLink href='\groups'>
              Groups
            </ListItemLink>
            <ListItemLink href='\requests'>
              Requests
            </ListItemLink>
            <ListItemLink href='\notifs'>
              Notifications
            </ListItemLink>
            <ListItemLink href='\logout'>
              Logout
            </ListItemLink>
          </List>
        </Drawer>
      :
        ''
    }
    
    </div>
  );
}