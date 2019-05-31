import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { Link,BrowserRouter } from 'react-router-dom';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

function ButtonAppBar(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <AppBar position="static" >
        <Toolbar>
            <div id='navbar-items'>
                <BrowserRouter>
                    <Link to='/'>
                        <Button color="inherit">Requests</Button>
                    </Link>
                </BrowserRouter>
                <Button color="inherit">Groups</Button>     
                <Button color="inherit">Notification</Button>
                <Button color="inherit">LogOut</Button>
            </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}


export default withStyles(styles)(ButtonAppBar);
