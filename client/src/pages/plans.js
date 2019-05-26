import React from 'react';
import axios from 'axios';
import Card from '../plans-notifs/card';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Container from '@material-ui/core/Container';
import PickersDialog from '../plans-notifs/PickersDialog';


export default class Groups extends React.Component {

    state = {
        created_groups: [],
        joined_groups: [],
        value: 0,
        showTimeDialog: false,
        timeChangeGroup: '',
        timeChangeDeparture: new Date(),
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

    removeGroup = (groupId, index) => {
        axios.post('http://192.168.0.103:5000/remove_group', {
            groupId: groupId,
        })
        .then((res) => {
            var newArray = [...this.state.created_groups];
            newArray.splice(index, 1);
            this.setState({created_groups: newArray});
        })
        .catch((err) => {
            console.log(err);
        });
    }

    handleTimeChange = (time) => {
        
        axios.post('http://192.168.0.103:5000/request/change_time', {
            groupId: this.state.timeChangeGroup,
            departure: time,
        })
        .then((res) => {
            var newArray = [...this.state.created_groups];
            for (var i = 0; i < newArray.length; i++) {
                if (newArray[i]._id === this.state.timeChangeGroup) {
                    newArray[i].departure = time;
                    break;
                }
            }
            this.setState({created_groups: newArray});
        })
        .catch((err) => {
            console.log(err);
            // display dialog box
        });
    }

    openDialog = (groupId, departure) => {
        this.setState({showTimeDialog: true, 
            timeChangeGroup: groupId, 
            timeChangeDeparture: new Date(departure)
        });
    }

    closeDialog = () => {
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
                        {this.getGroups().map((item, index) => 
                            <Card
                            key={item._id}
                            id={item._id} 
                            departure = {item.departure}
                            from = {item.from}
                            to = {item.to}
                            status = {item.status}
                            members = {item.members}
                            timeChange = {this.openDialog}
                            remove = {() => this.removeGroup(item._id, index)} 
                            />
                        )}
                    </Container>
                </Grid>
            </Grid>
            <PickersDialog
            initialTime={this.state.timeChangeDeparture} 
            open={this.state.showTimeDialog} 
            onClose={this.closeDialog}
            onTimeChange={this.handleTimeChange} />
            </div>
        )
    }
}