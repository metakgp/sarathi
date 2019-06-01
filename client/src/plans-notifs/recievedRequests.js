import React from 'react';
import Card from '@material-ui/core/Card';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';

import Avatar from '@material-ui/core/Avatar';
import { CardActions, Divider } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import moment from 'moment';

export default function ReceivedRequestCard(props) {
    
    return (
        <Card style={{width: props.width, marginBottom: 5}}>
            <div style={{margin: 5}}>
                <Chip label={props.from + ' to '+props.to} 
                variant='outlined' 
                style={{margin:5}} />
                <Chip label={moment(props.departure).format('Do MMMM')} 
                variant='outlined' 
                style={{margin:5}} />
                <Chip label={moment(props.departure).format('hh:mm a')} 
                variant='outlined' 
                style={{margin:5}} />
                <Chip label={props.members + ' members'} 
                variant='outlined' 
                style={{margin:5}} />
            </div>
            <Divider variant='middle' />
            <div style={{padding: 10, display: 'flex', alignItems: 'center'}}>
                <Avatar 
                alt='Remy Sharp' 
                src='http://192.168.0.103:5000/images/user-image.png'
                style={{margin: 10, height: 50, width: 50}}
                />
                <div style={{padding: 5}}>
                    <Typography variant='h6'>{props.traveler.name}</Typography>
                    <Typography component='span' variant='body2'>
                        Flight Time: {moment(props.traveler.time).format('hh:mm a')}
                    </Typography>
                </div>
            </div>
            <CardActions>
                <Button onClick={props.approve}>Approve</Button>
                <Button onClick={props.reject}>Reject</Button>
            </CardActions>
        </Card>
    )

}
