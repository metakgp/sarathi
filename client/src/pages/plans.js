import React from 'react';
import axios from 'axios';
import Card from '../plans-notifs/card';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Container from '@material-ui/core/Container';
import PickersDialog from '../plans-notifs/PickersDialog';
import ConfirmDialog from '../plans-notifs/confirmDialog';


export default class Groups extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            created_groups: [],
            joined_groups: [],
            value: 0,
            showTimeDialog: false,
            showGroupRemoveDialog: false,
            groupRemoveCallback: undefined,
            showGroupLeaveDialog: false,
            groupLeaveCallback: undefined,
            timeChangeGroup: '',
            timeChangeDeparture: new Date(),
            contentSectionHeight: 0,
            contentSectionWidth: 0,
        }
        this.updateContentSectionHeight = this.updateContentSectionHeight.bind(this);
    }

    componentDidMount() {
        axios.get('http://192.168.0.103:5000/user/my_groups?fb_id=2177672832321382')
        .then(res => {
            this.setState({created_groups: res.data.created, joined_groups: res.data.joined})
        })
        .catch(err => {
            console.log(err.data);
        });
        this.updateContentSectionHeight();
        window.addEventListener('resize', this.updateContentSectionHeight);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateContentSectionHeight);
    }

    updateContentSectionHeight() {
        const width = window.innerWidth < 500 ? window.innerWidth : 500;
        this.setState({contentSectionHeight: window.innerHeight - 48, contentSectionWidth: width});
    }

    handleTabChange = (event, value) => {
        this.setState({value: value});
    }

    handleRemoveGroup = (groupId, index) => {
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
        this.closeGroupRemoveDialog();
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

    handleLeaveGroup = (groupId, index) => {
        axios.post('http://192.168.0.103:5000/leave_group?fb_id=2177672832321382', {
            groupId: groupId,
        })
        .then((res) => {
            var newArray = [...this.state.joined_groups];
            newArray.splice(index, 1);
            this.setState({joined_groups: newArray});
        })
        .catch((err) => {
            console.log(err);
        });
        this.closeLeaveGroupDialog();
    }

    // functions for handling dialog boxes for different cases

    openDialog = (groupId, departure) => {
        this.setState({showTimeDialog: true, 
            timeChangeGroup: groupId, 
            timeChangeDeparture: new Date(departure)
        });
    }

    closeDialog = () => {
        this.setState({showTimeDialog: false});
    }

    openGroupRemoveDialog = (confirmCallback) => {
        this.setState({showGroupRemoveDialog: true, groupRemoveCallback: confirmCallback});
    }

    closeGroupRemoveDialog = () => {
        this.setState({showGroupRemoveDialog: false, groupRemoveCallback: undefined});
    }

    openLeaveGroupDialog = (confirmCallback) => {
        this.setState({showGroupLeaveDialog: true, groupLeaveCallback: confirmCallback});
    }

    closeLeaveGroupDialog = () => {
        this.setState({showGroupLeaveDialog: false, groupLeaveCallback: undefined});
    }

    render() {
        
        return (
            <div>
            <Grid container direction='column' alignItems='center' spacing={5}>
                <Grid item style={{padding: 0}}>
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
                <Grid item style={{width: '100%', height: this.state.contentSectionHeight, overflowX: 'hidden', overflowY: 'scroll'}}>
                    <Container style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        {this.state.value ? 
                            this.state.joined_groups.map((item, index) => <Card
                            key={item._id}
                            id={item._id} 
                            width={this.state.contentSectionWidth}
                            departure = {item.departure}
                            from = {item.from}
                            to = {item.to}
                            status = {item.status}
                            members = {item.members}
                            leave = {() => this.openLeaveGroupDialog(() => 
                            this.handleLeaveGroup(item._id, index))} 
                            />)
                        :
                            this.state.created_groups.map((item, index) => 
                            <Card
                            key={item._id}
                            id={item._id}
                            width={this.state.contentSectionWidth} 
                            departure = {item.departure}
                            from = {item.from}
                            to = {item.to}
                            status = {item.status}
                            members = {item.members}
                            timeChange = {this.openDialog}
                            remove = {() => this.openGroupRemoveDialog(() => 
                            this.handleRemoveGroup(item._id, index))} 
                            />)
                        }
                    </Container>
                </Grid>
            </Grid>
            <PickersDialog
            initialTime={this.state.timeChangeDeparture} 
            open={this.state.showTimeDialog} 
            onClose={this.closeDialog}
            onTimeChange={this.handleTimeChange} />
            <ConfirmDialog
            open={this.state.showGroupRemoveDialog}
            onClose={this.closeGroupRemoveDialog}
            onConfirm={this.state.groupRemoveCallback}
            body='This will remove the group and all its members'
            />
            <ConfirmDialog
            open={this.state.showGroupLeaveDialog}
            onClose={this.closeLeaveGroupDialog}
            onConfirm={this.state.groupLeaveCallback}
            body='You will no longer be a member of this group' />
            </div>
        )
    }
}