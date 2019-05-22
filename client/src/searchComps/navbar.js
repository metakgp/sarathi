import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
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
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.grow} onClick={() => console.log('yo')}>
            Welcome 
          </Typography>
            <BrowserRouter>
              <Link to='/'><Button color="inherit">Home</Button></Link>
            </BrowserRouter> 
            <BrowserRouter> 
              <Link to="/plans"><Button color="inherit">Plans</Button></Link>
            </BrowserRouter>
            <BrowserRouter>
              <Link to="/notifs"><Button color="inherit">Notifications</Button></Link>
            </BrowserRouter>
            <Button color="inherit">Log Out</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
} 


export default withStyles(styles)(ButtonAppBar);
