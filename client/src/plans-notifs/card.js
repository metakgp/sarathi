import React from 'react';
import Card from '@material-ui/core/Card';
import Chip from '@material-ui/core/Chip';
import '../styles/App.scss';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { CardActions, Button, ListItemAvatar } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';

   
export default function SimpleCard (props) {

  // Displays button according to date provided through props
  var buttonHTML = props.buttons.map(item => 
    (<Button 
    size='large' 
    style={{padding: 5}} 
    onClick={() => item.onClick(props.id)}>
    {item.text}
    </Button>)
  );

  return (
    <Card style={{minWidth: 400, maxWidth: 500}}>
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
        {props.members.map((item, index) => {
          const chip = index === 0 ? <Chip label='creator' color='primary'/> : '';
          return (
            <ListItem key={item.fb_id}>
                <ListItemAvatar>
                    <Avatar alt='Remy Sharp' src='http://localhost:5000/images/user-image.png' />
                </ListItemAvatar>
                <ListItemText primary={item.name} secondary={
                    <React.Fragment>
                        <Typography component='span' variant='body2'>Flight Time : {moment(item.time).format('hh:mm a')}</Typography>
                    </React.Fragment>
                }></ListItemText>
                {chip}
            </ListItem>
          )
        })}
      </List>
      {
        props.hasButton ? 
        <CardActions>
          {buttonHTML}
        </CardActions> :
        ''
      }
      
    </Card>
  )
}

