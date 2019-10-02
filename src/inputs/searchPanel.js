import React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import MaterialSelect from './select'
import MaterialDate from './datePicker'
import TimeSelect from './timePicker'
import  '../styles/App.scss';
import { Paper, Grid, Button, Typography } from '@material-ui/core';
import moment from 'moment'


export default function SearchPanel(props) {
    const matches = useMediaQuery('(max-width: 768px)');

    const gridProps = matches ?
    {
        justify: 'center',
        alignItems: 'center',
        style: {
            height: props.contentSectionHeight,
        }
    } :
    {
        justify: 'center',
    };

    const appBarHeight = document.getElementById('appBar').clientHeight;

    return (
        <Paper id='search_section' style={{position: 'fixed', top: appBarHeight, left: 0, width: '100%', zIndex: 1}}>
            {matches && props.collapse ? 
            <Grid container direction='column' style={{padding: 5}} onClick={props.onClick}>
                <Grid item>
                    <Typography variant='body1'>{props.fromPlace} to {props.toPlace}</Typography>
                </Grid>
                <Grid item>
                    <Typography variant='body1'>
                        {moment(props.time).format('Do MMMM')} | {moment(props.time).format('hh:mm a')}
                    </Typography>
                </Grid>
            </Grid>
            :
            <Grid container {...gridProps}>
                <Grid item xs={12} sm={6} lg={2}>
                    <MaterialSelect 
                    dir='FROM' 
                    initialValue={props.fromPlace} 
                    onPassData={props.setFromPlace} />
                </Grid>
                <Grid item xs={12} sm={6} lg={2}>
                    <MaterialSelect 
                    dir='TO' 
                    initialValue={props.toPlace}
                    onPassData = {props.setToPlace} />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <MaterialDate 
                    label='Date of Departure' 
                    onPassData = {props.setDate} 
                    initialValue = {props.time} />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <TimeSelect 
                    label='Time of Departure' 
                    onPassData = {props.setTime}
                    initialValue = {props.time}
                    />
                </Grid>
                <Grid item xs={12} sm={12} lg={2}  style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}>
                    <Button onClick={props.handleSearch} color='primary' size='large' style={{margin: 5}}>
                    Search
                    </Button>
                </Grid>
            </Grid>}
        </Paper>
    );
}