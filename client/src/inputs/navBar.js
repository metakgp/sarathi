import React, { useState, useEffect } from 'react';
import {AppBar, Toolbar, Link, Drawer, IconButton, List, ListItem, Badge} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import axios from 'axios';

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
  
  const [open, setOpen] = useState(false);
  const [groupsCount, setGroupsCount] = useState(0);
  const [requestsCount, setRequestsCount] = useState(0);
  const [notifCount, setNotifCount] = useState(0);


  const closeDrawer = () => {
    setOpen(false);
  };

  const openDrawer = () => {
    setOpen(true);
  };

  const matches = useMediaQuery('(max-width: 768px)');

  const getBadgeCounts = async () => {

    try {
      var groups = (await axios.get('/api/user/groups_count')).data;
      setGroupsCount(groups);
    }
    catch {}

    try {
      var requests = (await axios.get('/api/user/requests_count')).data;
      setRequestsCount(requests);
    }
    catch {}

    try {
      var notifs = (await axios.get('/api/user/unread_notif_count')).data;
      setNotifCount(notifs);
    }
    catch {}
    
  };

  var badgeInterval = null;
  
  useEffect(() => {
    async function fetchData() {

      getBadgeCounts();
      badgeInterval = setInterval(getBadgeCounts, 1000 * 60 * 2);

    }
    fetchData();

    return () => {
      clearInterval(badgeInterval);
    }

  }, []);
  
  return (
    <div style={{flexGrow: 1}}>
    <AppBar id='appBar'>
        <Toolbar>
          <Link variant='h4' color='inherit' underline='none' style={{flexGrow: 1}} href='/'>
            Sarathi
          </Link>
          { matches ?
              <IconButton edge="start" color="inherit" aria-label="Menu" onClick={openDrawer}>
                <MenuIcon />
              </IconButton>
            :
              <div>
              <Badge color='secondary' badgeContent={groupsCount}>
                    <Link variant='button' color='inherit' underline='none' style={{marginRight: 10, marginLeft: 20}} href='/groups'>
                    Groups
                    </Link>
              </Badge>
              <Badge color='secondary' badgeContent={requestsCount}>
                  <Link variant='button' color='inherit' underline='none' style={{marginRight: 10, marginLeft: 20}} href='/requests'>
                  Requests
                  </Link>
              </Badge>
              <Badge color='secondary' badgeContent={notifCount}>
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
            <ListItemLink href='\groups' badgeCount={groupsCount}>
              Groups
            </ListItemLink>
            <ListItemLink href='\requests' badgeCount={requestsCount}>
              Requests
            </ListItemLink>
            <ListItemLink href='\notifs' badgeCount={notifCount}>
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