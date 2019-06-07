import React from 'react';
import axios from 'axios';
import Card from '../plans-notifs/card';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PickersDialog from '../plans-notifs/PickersDialog';
import ConfirmDialog from '../plans-notifs/confirmDialog';

import EmptyMessage from '../plans-notifs/emptyMessage';


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
            showCloseStatusDialog: false,
            closeStatusCallback: undefined,
            timeChangeGroup: '',
            timeChangeDeparture: new Date(),
            contentSectionHeight: 0,
            contentSectionWidth: 0,
        }
        this.updateContentDimensions = this.updateContentDimensions.bind(this);
    }

    componentDidMount() {
        axios.get('/user/my_groups?fb_id=2177672832321382')
        .then(res => {
            this.setState({created_groups: res.data.created, joined_groups: res.data.joined})
        })
        .catch(err => {
            console.log(err.data);
        });
        this.updateContentDimensions();
        window.addEventListener('resize', this.updateContentDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateContentDimensions);
    }

    updateContentDimensions() {
        const width = window.innerWidth < 500 ? window.innerWidth : 500;
        this.setState({contentSectionHeight: window.innerHeight - 48 - 46, contentSectionWidth: width});
    }

    handleTabChange = (event, value) => {
        this.setState({value: value});
    }

    handleRemoveGroup = (groupId, index) => {
        axios.post('/remove_group', {
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
        
        axios.post('/request/change_time', {
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
        axios.post('/leave_group?fb_id=2177672832321382', {
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

    handleToggleStatus = (groupId, index) => {
        axios.post('/group/toggle_status', {
            groupId: groupId,
            status: this.state.created_groups[index].status,
        })
        .then(res => {
            var newArray = [...this.state.created_groups];
            newArray[index].status = res.data;
            this.setState({created_groups: newArray});
        })
        .catch(err => console.log(err));
        this.closeCloseStatusDialog();
    }

    onToggleStatus = (status, confirmCallback) => {
        if (status === 'open')
            this.openCloseStatusDialog(confirmCallback);
        else
            confirmCallback();
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

    openCloseStatusDialog = (confirmCallback) => {
        this.setState({showCloseStatusDialog: true, closeStatusCallback: confirmCallback});
    }

    closeCloseStatusDialog = () => {
        this.setState({showCloseStatusDialog: false, closeStatusCallback: undefined});
    }

    render() {
        
        return (
            <div>
                <Tabs 
                value={this.state.value}
                onChange={this.handleTabChange} 
                textColor='primary' 
                indicatorColor='primary' 
                centered
                style={{position: 'fixed', top: '46px', width: '100%', zIndex: 1}}>
                    <Tab label='Created' />
                    <Tab label='Joined' />
                </Tabs>
                <div style={{position: 'relative', top: '48px', height: this.state.contentSectionHeight, overflow: 'auto'}}>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    {this.state.value ?
                        this.state.joined_groups.length ?
                        this.state.joined_groups.map((item, index) => 
                        <Card
                        key={item._id}
                        id={item._id} 
                        width={this.state.contentSectionWidth}
                        departure = {item.departure}
                        from = {item.from}
                        to = {item.to}
                        owner = {item.owner}
                        status = {item.status}
                        members = {item.members}
                        leave = {() => this.openLeaveGroupDialog(() => 
                        this.handleLeaveGroup(item._id, index))} 
                        />) :
                        <EmptyMessage>No groups joined</EmptyMessage>
                    :
                        this.state.created_groups.length ?
                        this.state.created_groups.map((item, index) => 
                        <Card
                        key={item._id}
                        id={item._id}
                        width={this.state.contentSectionWidth} 
                        departure = {item.departure}
                        from = {item.from}
                        to = {item.to}
                        status = {item.status}
                        owner = {item.owner}
                        members = {item.members}
                        timeChange = {this.openDialog}
                        remove = {() => this.openGroupRemoveDialog(() => 
                        this.handleRemoveGroup(item._id, index))}
                        statusToggle={() => this.onToggleStatus(item.status, () =>
                        this.handleToggleStatus(item._id, index))}
                        />) :
                        <EmptyMessage>No groups created</EmptyMessage>
                    }
                </div>
                </div>
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
                <ConfirmDialog
                open={this.state.showCloseStatusDialog}
                onClose={this.closeCloseStatusDialog}
                onConfirm={this.state.closeStatusCallback}
                body='No further requests to this group will be received' />      
            </div>
        )
    }
}