import React from 'react';
import axios from 'axios';
import Card from '../displays/card';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Snackbar from '@material-ui/core/Snackbar';
import PickersDialog from '../displays/PickersDialog';
import ConfirmDialog from '../displays/confirmDialog';

import EmptyMessage from '../displays/emptyMessage';


const closeStatusMessage = 'You should close the group only when you dont want to add more members to it. No person can request to join a closed group.'
const removeGroupMessage = 'This will remove the group and all its members permanently.'
const leaveGroupMessage = 'You will no longer be a part of this group and receieve updates regarding this group'

const groupRemovedMessage = 'Group removed';
const changedTimeMessage = 'Departure time changed';
const leftGroupMessage = 'Group left';
const networkErrorMessage = 'Something went wrong. Please check your network connection'

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
            contentSectionMargin: 0,
            contentSectionHeight: 0,
            contentSectionWidth: 0,
            appBarHeight: 0,
            snackBarMessage: undefined,
        }
        this.updateContentDimensions = this.updateContentDimensions.bind(this);
    }

    componentDidMount() {
        axios.get('/api/user/groups')
        .then(res => {
            this.setState({created_groups: res.data.created, joined_groups: res.data.joined})
        })
        .catch(err => {
            console.log(err);
        });
        this.updateContentDimensions();
        window.addEventListener('resize', this.updateContentDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateContentDimensions);
    }

    updateContentDimensions() {
        const width = window.innerWidth < 500 ? window.innerWidth : 500;
        const appBarHeight = document.getElementById('appBar').clientHeight;
        const contentSectionMargin = 48 + appBarHeight;
        this.setState({
            contentSectionMargin: contentSectionMargin,
            contentSectionHeight: window.innerHeight - contentSectionMargin, 
            contentSectionWidth: width, 
            appBarHeight: appBarHeight
        });
    }

    handleTabChange = (event, value) => {
        this.setState({value: value});
    }

    handleRemoveGroup = (groupId, index) => {
        axios.post('/api/group/remove_group', {
            groupId: groupId,
        })
        .then((res) => {
            var newArray = [...this.state.created_groups];
            newArray.splice(index, 1);
            this.setState({created_groups: newArray, snackBarMessage: groupRemovedMessage});
        })
        .catch((err) => {
            console.log(err);
            this.setState({snackBarMessage: networkErrorMessage});
        });
        this.closeGroupRemoveDialog();
    }

    handleTimeChange = (time) => {
        
        axios.post('/api/group/change_time', {
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
            this.setState({created_groups: newArray, snackBarMessage: changedTimeMessage});
        })
        .catch((err) => {
            console.log(err);
            this.setState({snackBarMessage: networkErrorMessage});
        });
    }

    handleLeaveGroup = (groupId, index) => {
        axios.post('/api/group/leave_group', {
            groupId: groupId,
        })
        .then((res) => {
            var newArray = [...this.state.joined_groups];
            newArray.splice(index, 1);
            this.setState({joined_groups: newArray, snackBarMessage: leftGroupMessage});
        })
        .catch((err) => {
            console.log(err);
            this.setState({snackBarMessage: networkErrorMessage});
        });
        this.closeLeaveGroupDialog();
    }

    handleToggleStatus = (groupId, index) => {
        axios.post('/api/group/toggle_status', {
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

    snackBarOnClose = () => {
        this.setState({snackBarMessage: undefined});
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
                style={{position: 'fixed', top: this.state.appBarHeight, width: '100%', zIndex: 1}}>
                    <Tab label='Created' />
                    <Tab label='Joined' />
                </Tabs>
                <div style={{position: 'relative', top: this.state.contentSectionMargin, height: this.state.contentSectionHeight, overflow: 'auto'}}>
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
                <Snackbar
                open={this.state.snackBarMessage}
                onClose={this.snackBarOnClose}
                autoHideDuration={6000}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">{this.state.snackBarMessage}</span>}
                />
                <PickersDialog
                initialTime={this.state.timeChangeDeparture} 
                open={this.state.showTimeDialog} 
                onClose={this.closeDialog}
                onTimeChange={this.handleTimeChange} />
                <ConfirmDialog
                open={this.state.showGroupRemoveDialog}
                onClose={this.closeGroupRemoveDialog}
                onConfirm={this.state.groupRemoveCallback}
                body={removeGroupMessage}
                />
                <ConfirmDialog
                open={this.state.showGroupLeaveDialog}
                onClose={this.closeLeaveGroupDialog}
                onConfirm={this.state.groupLeaveCallback}
                body={leaveGroupMessage} />
                <ConfirmDialog
                open={this.state.showCloseStatusDialog}
                onClose={this.closeCloseStatusDialog}
                onConfirm={this.state.closeStatusCallback}
                body={closeStatusMessage} />      
            </div>
        )
    }
}