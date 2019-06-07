import React from 'react';
import Card from '@material-ui/core/Card';
import Chip from '@material-ui/core/Chip';
import '../styles/App.scss';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Button, ListItemAvatar, CardActions, Switch, FormControlLabel } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';


export default function SimpleCard (props) {

  var buttonHTML = [];
  if (props.timeChange) {
    buttonHTML.push(<Button 
    onClick={() => props.timeChange(props.id, props.departure)}>
    Change Time
    </Button>)
  }

  if (props.join) {
    var buttonDisabled = false;
    var buttonText = "join";
    if (props.status === 'request_sent') {
      buttonDisabled = true;
      buttonText = "Request sent"
    }
    else if (props.status === 'joined') {
      buttonDisabled = true;
      buttonText = "already a member";
    }
    else if (props.status === 'closed') {
      buttonDisabled = true;
      buttonText = "closed";
    }

    buttonHTML.push(<Button
    disabled={buttonDisabled} 
    onClick={props.join}>
    {buttonText}
    </Button>)
  }

  if (props.remove) {
    buttonHTML.push(<Button
    onClick={props.remove}>
    Remove
    </Button>)
  }

  if (props.leave) {
    buttonHTML.push(<Button
    onClick={props.leave}>
    Leave
    </Button>)
  }

  return (
    <Card style={{width: props.width, marginBottom: 10}}>
      {props.statusToggle ? 
      (
        <FormControlLabel
        style={{paddingLeft: 10, width: '100%', background: '#efefef'}}
        control={
          <Switch
          checked={props.status === 'open'}
          onChange={props.statusToggle}
          color='primary'/>
        } 
        label={props.status} />
        ) : ''}
      <Grid container style={{padding: 10, background: '#efefef'}}>
          <Grid item xs>
              <Typography variant='h5' gutterBottom>
                  {moment(props.departure).format('Do MMMM')} 
              </Typography>
              <Typography variant='subtitle2'>
                {props.from} to {props.to}
              </Typography>
          </Grid>
          <Grid item>
              <Typography variant='h5' gutterBottom>
                  {moment(props.departure).format('hh:mm a')}
              </Typography>
          </Grid>
      </Grid>
      <List style={{padding: 5}}>
        <ListItem key={props.owner.fb_id}>
          <ListItemAvatar>
              <Avatar alt='Remy Sharp' src={'/images/' + props.owner.fb_id + '.jpg'} />
          </ListItemAvatar>
          <ListItemText primary={props.owner.name} secondary={
              <React.Fragment>
                  <Typography component='span' variant='body2'>Flight Time : {moment(props.owner.time).format('hh:mm a')}</Typography>
              </React.Fragment>
          }></ListItemText>
          <Chip label='creator' color='primary' variant='outlined' />
        </ListItem>
        {props.members.map((item, index) => {
          return (
            <ListItem key={item.fb_id}>
              <ListItemAvatar>
                  <Avatar alt='Remy Sharp' src={'/images/' + item.fb_id + '.jpg'} />
              </ListItemAvatar>
              <ListItemText primary={item.name} secondary={
                  <React.Fragment>
                      <Typography component='span' variant='body2'>Flight Time : {moment(item.time).format('hh:mm a')}</Typography>
                  </React.Fragment>
              }></ListItemText>
            </ListItem>
          )
        })}
      </List>
      <CardActions>
      {buttonHTML}
      </CardActions>
    </Card>
  )
}

