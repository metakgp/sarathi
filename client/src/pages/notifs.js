import React, {Component} from 'react'
import axios from 'axios'
import {List, Grid, ListItem, Avatar, Typography} from '@material-ui/core'

export default class Notifications extends Component {
    
    state = {
        notifications: [],
    }

    componentDidMount() {
        axios.get('http://192.168.0.103:5000/user/my_notifications?fb_id=2177672832321382')
        .then((res) => {
            this.setState({notifications: res.data});
        })
        .catch(err => console.log(err));
    }

    render() {
        return (
            <List>
            {this.state.notifications.map(item =>
                (<ListItem alignItems="flex-start">
                <Grid container spacing={2}>
                    <Grid item style={{display: 'flex', alignItems: 'center'}}>
                        <Avatar 
                        alt='Arib Alam' 
                        src='http://192.168.0.103:5000/images/user-image.png'
                        style={{height: 60, width: 60}} />
                    </Grid>
                    <Grid item xs style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                        <Typography variant='body1'>{item.message}</Typography>
                        <Typography variant='caption'>{item.created_on}</Typography>
                    </Grid>
                </Grid>
                </ListItem>)
            )}
            </List>
        );
    }
}

{/* <ListItemAvatar>
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
</React.Fragment>} /> */}