import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import {ListItemAvatar, Avatar, Grid, ListSubheader, Chip, Link} from '@material-ui/core'
import moment from 'moment'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function FullScreenDialog(props) {

  return (
    <div>
      <Dialog fullScreen open={props.open} onClose={props.onClose} TransitionComponent={Transition}>
        <AppBar style={{position: 'relative'}}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={props.onClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        { props.group ? 
            <div>
                <Grid container style={{padding: 10}}>
                    <Grid item xs>
                        <Typography variant='h4' gutterBottom>
                            {moment(props.group.departure).format('Do MMMM')}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant='h4' gutterBottom>
                            {moment(props.group.departure).format('hh:mm a')}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant='subtitle1'>
                        {props.group.from} to {props.group.to}
                        </Typography>
                    </Grid>
                </Grid>
                <Divider />
                <List 
                style={{padding: 5}}
                subheader={<ListSubheader component="div">Members</ListSubheader>}>
                  <ListItem key={props.group.owner.fb_id}>
                    <ListItemAvatar>
                        <Avatar alt='Remy Sharp' src={'http://graph.facebook.com/' + props.group.owner.fb_id + '/picture?type=square'} />
                    </ListItemAvatar>
                    <ListItemText primary={
                      <React.Fragment>
                        <Link color='inherit' href={props.group.owner.profile}>{props.group.owner.name}</Link>
                      </React.Fragment>
                      } secondary={
                        <React.Fragment>
                            <Typography component='span' variant='body2'>Boarding Time : {moment(props.group.owner.time).format('hh:mm a')}</Typography>
                        </React.Fragment>
                    }></ListItemText>
                    <Chip label='creator' color='primary' variant='outlined' />
                  </ListItem>
                {props.group.members.map((item, index) => {
                    return (
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar alt='Remy Sharp' src={'http://graph.facebook.com/' + item.fb_id + '/picture?type=square'} />
                        </ListItemAvatar>
                        <ListItemText primary={
                          <React.Fragment>
                            <Link color='inherit' href={item.profile}>{item.name}</Link>
                          </React.Fragment>
                          } secondary={
                            <React.Fragment>
                                <Typography component='span' variant='body2'>Boarding Time : {moment(item.time).format('hh:mm a')}</Typography>
                            </React.Fragment>
                        }></ListItemText>
                    </ListItem>
                    )
                })}
                </List>
            </div>
        : ''}
      </Dialog>
    </div>
  );
}

export default FullScreenDialog;