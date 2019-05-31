import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const SampleNotifs = [
  {
    message: 'x has agreed to join u from kgp to ccu vx has agreed to join u from kgp to ccu',
    time: '15 min ago'
  },
  {
    message: 'x has agreed to join u from kgp to ccu',
    time: '15 min ago'
  },
  {
    message: 'x has agreed to join u from kgp to ccu',
    time: '15 min ago'
  },
  
]


const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
}));

 
function AlignItemsList(props) {
  const classes = useStyles();

  return (
    <div id='notif-cards'>
        <List className={classes.root}>
            {
              SampleNotifs.map(item => {
                return(
                  <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                  </ListItemAvatar>
                  <ListItemText
                  primary={item.message}
                  secondary={
                      <React.Fragment>
                      <Typography
                          component="span"
                          variant="body2"
                          className={classes.inline}
                          color="textPrimary"
                      >
                      {item.time}
                      </Typography>
                      </React.Fragment>
                      
                  }
                  />
                  </ListItem>

                )
              })
            }
             </List>
     </div>
  );
}

export default AlignItemsList;
