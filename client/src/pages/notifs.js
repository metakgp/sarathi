import React, {Component} from 'react'
import axios from 'axios'
import {List, Grid, ListItem, Avatar, Typography, Divider} from '@material-ui/core'
import moment from 'moment'
import FullScreenDialog from '../plans-notifs/FullScreenDialog'

export default class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notifications: [],
            contentSectionHeight: 0,
            contentSectionWidth: 0,
            showFullScreenDialog: false,
            dialogGroup: undefined,
        };
        this.updateContentSectionDimensions = this.updateContentSectionDimensions.bind(this);
    }

    componentDidMount() {
        axios.get('http://192.168.0.103:5000/user/my_notifications?fb_id=2177672832321382')
        .then((res) => {
            this.setState({notifications: res.data.reverse()});
        })
        .catch(err => console.log(err));
        this.updateContentSectionDimensions();
        window.addEventListener('resize', this.updateContentSectionDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateContentSectionHeight);
    }

    updateContentSectionDimensions() {
        const width = window.innerWidth < 500 ? window.innerWidth : 500;
        this.setState({contentSectionHeight: window.innerHeight - 46, contentSectionWidth: width});
    }

    handleNotifClick(notifId, groupId, index) {
        this.openFullScreenDialog();
        // get group info from the notification object 
        axios.get('http://192.168.0.103:5000/group/' + groupId)
        .then(res => {
            console.log(res.data);
            this.setState({showFullScreenDialog: true, dialogGroup: res.data});

            //change read status of notification object in the database
            axios.post('http://192.168.0.103:5000/notification/read_notif', {
                notifId: notifId,
            })
            .then(res => {
                // change the read status of the notif object
                var newArray = [...this.state.notifications];
                newArray[index].read = true;
                this.setState({notifications: newArray});
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    }

    openFullScreenDialog = () => {
        this.setState({showFullScreenDialog: true});
    }

    closeFullScreenDialog = () => {
        this.setState({showFullScreenDialog: false});
    }

    render() {
        return (
            <div>
            <List style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div>
            {this.state.notifications.map((item, index) =>
            <div style={{width: this.state.contentSectionWidth}}>
                <ListItem 
                button={!item.read}
                alignItems="flex-start" 
                onClick={() => this.handleNotifClick(item._id, item.object_id, index)} 
                style={item.read ? {backgroundColor: '#efefef'} : {}}>
                    <Grid container spacing={2}>
                        <Grid item style={{display: 'flex', alignItems: 'center'}}>
                            <Avatar 
                            alt='Arib Alam' 
                            src={'http://192.168.0.103:5000/images/' + item.subject.fb_id + '.jpg'}
                            style={{height: 60, width: 60}} />
                        </Grid>
                        <Grid item xs style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                            <Typography variant='body1'>{item.message}</Typography>
                            <Typography variant='caption'>{moment(item.created_on).fromNow()}</Typography>
                        </Grid>
                    </Grid>
                </ListItem>
                <Divider />
            </div>
            )}
            </div>
            </List>
            <FullScreenDialog 
            open={this.state.showFullScreenDialog} 
            onClose={this.closeFullScreenDialog}
            group={this.state.dialogGroup} />
            </div>
        );
    }
}


// join_request
// approve_request

// change_time
// remove_group
// leave_group
