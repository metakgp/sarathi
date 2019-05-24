import React from 'react';
import axios from 'axios';
import Card from '../plans-notifs/card';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Container from '@material-ui/core/Container';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { TimePicker, MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

export default class Groups extends React.Component {

    state = {
        created_groups: [],
        joined_groups: [],
        value: 0,
        showTimeDialog: false,
        timeChangeData: {
            groupId: '',
            time: new Date()
        }
    }

    componentDidMount() {
        axios.get('http://192.168.0.103:5000/user/my_groups?fb_id=2177672832321382')
        .then(res => {
            this.setState({created_groups: res.data.created, joined_groups: res.data.joined})
        })
        .catch(err => {
            console.log(err.data);
        }); 
    }

    handleTabChange = (event, value) => {
        this.setState({value: value});
    }

    getGroups = () => {
        if (this.state.value === 0)
            return this.state.created_groups;
        return this.state.joined_groups;
    }

    removeGroup = () => {
        console.log("Group to be removed");
    }

    changeTime = () => {
        axios.post('http://192.168.0.103:5000/request/change_time', {
            groupId: this.state.timeChangeData.groupId,
            departure: this.state.timeChangeData.time,
        })
        .then((res) => {
            // update state and group
            var newArray = [...this.state.created_groups];
            for (var i = 0; i < newArray.length; i++) {
                if (newArray[i]._id === this.state.timeChangeData.groupId) {
                    newArray[i].departure = new Date(this.state.timeChangeData.time.getTime());
                    break;
                }
            }
            this.setState({created_groups: newArray}); 
        })
        .catch((err) => {
            // display dialog box
        });
        this.closeDialog();
    }

    openDialog = (groupId) => {
        this.setState({showTimeDialog: true});
        this.setState({timeChangeData: {time: this.state.timeChangeData.time, groupId: groupId}});
    }

    closeDialog = () => {
        this.setState({timeChangeData: {groupId: '', time: new Date()}});
        this.setState({showTimeDialog: false});
    }

    render() {
        
        return (
            <div>
            <Grid container direction='column' alignItems='center' spacing={5}>
                <Grid item>
                    <Tabs 
                    value={this.state.value}
                    onChange={this.handleTabChange} 
                    textColor='primary' 
                    indicatorColor='primary' 
                    centered>
                        <Tab label='Created' />
                        <Tab label='Joined' />
                    </Tabs>
                </Grid>
                <Grid item>
                    <Container>
                        {this.getGroups().map(item => 
                            <Card
                            key={item._id}
                            id={item._id} 
                            departure = {item.departure}
                            from = {item.from}
                            to = {item.to}
                            status = {item.status}
                            members = {item.members}
                            hasButton = {true}
                            buttons={this.state.value ? [] : [ 
                                {text: 'change time', onClick: this.openDialog},
                                {text: 'remove', onClick: this.removeGroup},
                            ]} 
                            />
                        )}
                    </Container>
                </Grid>
            </Grid>
            <Dialog 
            open={this.state.showTimeDialog} 
            onClose={() => this.setState({showTimeDialog: false})}>
                <DialogTitle>Change departure</DialogTitle>
                <DialogContent>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker label='Select date' variant='inline' />
                        <TimePicker label='Select time' variant='inline'/>
                    </MuiPickersUtilsProvider>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.changeTime}>Change</Button>
                </DialogActions>
            </Dialog>
            </div>
        )
    }
}