import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
// import List from './lists'
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
  return (
    <Card style={{minWidth: 600}}>
      <Grid container style={{padding: 10, background: '#efefef'}}>
          <Grid item xs>
              <Typography variant='headline'>
                  {moment(props.departure).format('Do MMMM')} 
              </Typography>
              <Typography variant='subheading'>
                {props.from} to {props.to}
              </Typography>
          </Grid>
          <Grid item>
              <Typography variant='headline'>
                  {moment(props.departure).format('hh:mm a')}
              </Typography>
          </Grid>
      </Grid>
      <List style={{padding: 5}}>
        {props.members.map((item, index) => {
          return (
            <ListItem>
                <ListItemAvatar>
                    <Avatar alt='Remy Sharp' src='http://localhost:5000/images/user-image.png' />
                </ListItemAvatar>
                <ListItemText primary={item.name} secondary={
                    <React.Fragment>
                        <Typography variant='span'>Flight Time : {moment(item.time).format('hh:mm a')}</Typography>
                    </React.Fragment>
                }></ListItemText>
            </ListItem>
          )
        })}
      </List>
      <CardActions>
          <Button size='large' style={{padding: 5}}>Join</Button>
      </CardActions>
    </Card>
  )
}

