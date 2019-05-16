import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
});

var dupData = ['person1','person2','person3','person4']

function AlignItemsList(props) {
  const { classes } = props;
  return (
    <List className={classes.root}>
      {dupData.map(item => {
        return (<ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item}
                    flex-wrap="nowrap"
                  />
                </ListItem>)
      })}
    </List>
  );
}

AlignItemsList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AlignItemsList);
