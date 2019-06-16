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

    return (
        <Paper id='search_section' style={{position: 'fixed', top: 46, left: 0, width: '100%', zIndex: 1}}>
            <Grid container {...gridProps} >
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
                    <MaterialDate label='Date of Departure' onPassData = {props.setDate} />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <TimeSelect label='Time of Departure' onPassData = {props.setTime}  />
                </Grid>
                <Grid item xs={12} sm={12} lg={2}  style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}>
                    <Button onClick={props.handleSearch} color='primary' size='large' style={{margin: 5}}>
                    Search
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
}