import React from 'react';
import Card from '@material-ui/core/Card';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';

import Avatar from '@material-ui/core/Avatar';
import { CardActions, Divider } from '@material-ui/core';
import Button from '@material-ui/core/Button';

export default function SentRequestCard(props) {

    return (
        <Card style={{minWidth: 500, marginBottom: 5}}>
            <Grid container style={{padding: 10}}>
                <Grid item xs>
                    <Typography variant='h5'>
                    {moment(props.departure).format('Do MMMM')}
                    </Typography>
                    <Typography variant='subtitle2'>
                    {props.from} to {props.to}    
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant='h5'>
                    {moment(props.departure).format('hh:mm a')}
                    </Typography>
                </Grid>
            </Grid>
                <Divider variant='middle' />
                    <div style={{margin: 10}}>
                        <Chip
                        avatar={<Avatar alt='Remy Sharp' src='http://192.168.0.103:5000/images/user-image.png'/>} 
                        label={'Owner: ' + props.owner} 
                        variant='outlined' />
                        <Chip label={props.members + ' members'} variant='outlined' style={{margin:5}} />
                        <Chip label='open' variant='outlined' style={{margin:5}} />
                    </div>
            <CardActions>
                <Button onClick={props.cancel}>Cancel request</Button>
            </CardActions>
        </Card>
    )
}



