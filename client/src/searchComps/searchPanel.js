import React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import MaterialSelect from '../searchComps/material-select'
import MaterialDate from '../searchComps/materialDate'
import TimeSelect from '../searchComps/time'
import Card from '../plans-notifs/card';
import axios from 'axios';
import  '../styles/App.scss';
import { Paper, Grid, Button, Fab, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add'
import CreateGroupDialog from '../plans-notifs/CreateGroupDialog'
import moment from 'moment'
import EmptyMessage from '../plans-notifs/emptyMessage';


export default function SearchPanel(props) {
    const matches = useMediaQuery('(min-width: 768px)');
    return (
        <Paper id='search_section' style={{position: 'fixed', top: 46, left: 0, width: '100%', zIndex: 1}}>
            <Grid container align='center' direction='column' justify='space-evenly' style={{height: props.contentSectionHeight}}>
                <Grid item>
                    <MaterialSelect 
                    dir='FROM' 
                    initialValue={props.fromPlace} 
                    onPassData={props.setFromPlace} />
                </Grid>
                <Grid item>
                    <MaterialSelect 
                    dir='TO' 
                    initialValue={props.toPlace}
                    onPassData = {props.setToPlace} />
                </Grid>
                <Grid item>
                    <MaterialDate label='Date of Departure' onPassData = {props.setDate} />
                </Grid>
                <Grid item>
                    <TimeSelect label='Time of Departure' onPassData = {props.setTime}  />
                </Grid>
                <Grid item style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}>
                    <Button onClick={props.handleSearch} color='primary' size='large' style={{margin: 5}}>
                    Search
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
}