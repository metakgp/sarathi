import React from 'react';
import axios from 'axios';
import ReceivedRequestCard from '../displays/receivedRequestCard';
import SentRequestCard from '../displays/sentRequestCard';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import EmptyMessage from '../displays/emptyMessage';
import Snackbar from '@material-ui/core/Snackbar';
import Badge from '@material-ui/core/Badge';
import Footer from '../displays/footer'

const approvedMessage = 'Request Approved. The user has been added to your group';
const rejectMessage = 'Request Rejected';
const cancelMessage = 'Request Cancelled';
const networkErrorMessage = 'Something went wrong. Please check your network connection'

export default class Requests extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sent_requests: [],
            received_requests: [],
            value: 0,
            count: true,
            appBarHeight: 0,
            contentSectionMargin: 0,
            contentSectionHeight: 0,
            contentSectionWidth: 0,
            actionsDisabled: false,
            snackbarMessage: undefined,
        }
        this.updateContentSectionHeight = this.updateContentSectionHeight.bind(this);
    }

    componentDidMount() {
        axios.get('/api/user/requests')
        .then(res => {
            console.log(res.data.sent);
            var receivedRequestArray = res.data.received.map(item => {
                item.group.membersCount = item.group.members.length;
                return item;
            });
            var sentRequestArray = res.data.sent.map(item => {
                item.group.membersCount = item.group.members.length;
                return item;
            });
            this.setState({sent_requests: sentRequestArray, received_requests: receivedRequestArray})
        })
        .catch(err => {
            console.log(err);
        }); 
        this.updateContentSectionHeight();
        window.addEventListener('resize', this.updateContentSectionHeight);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateContentSectionHeight);
    }

    updateContentSectionHeight() {
        const width = window.innerWidth < 500 ? window.innerWidth : 500;
        const appBarHeight = document.getElementById('appBar').clientHeight;
        const margin = 48 + appBarHeight;
        const footerheight = document.getElementById('footer').clientHeight;
        this.setState({
            contentSectionHeight: window.innerHeight - margin - footerheight, 
            contentSectionWidth: width, 
            contentSectionMargin: margin,
            appBarHeight: appBarHeight,
        });
    }

    // updates all the member's (of the same group) count by 1
    updateMembers(array, index) {
        var groupId = array[index].group._id;
        for (var i = 0; i < array.length; i++) {
            if (array[i].group._id == groupId)
                array[i].group.membersCount++;
        }
    }

    handleTabChange = (event, value) => {
        this.setState({value: value});
    }

    getRequests = () => {
        if (this.state.value === 0)
            return this.state.sent_requests;
        return this.state.received_requests;
    }

    handleApprove = (requestId, index) => {
        this.setState({actionsDisabled: true})
        axios.post('/api/request/approve_request', {
            requestId: requestId
        })
        .then((res) => {
            var newArray = [...this.state.received_requests];
            this.updateMembers(newArray, index);
            newArray.splice(index, 1);
            this.setState({received_requests: newArray, actionsDisabled: false, snackBarMessage: approvedMessage});
        })
        .catch((err) => {
            console.log(err);
            this.setState({actionsDisabled: false, snackBarMessage: networkErrorMessage});
        });
    }

    handleReject = (requestId, index) => {
        this.setState({actionsDisabled: true});
        axios.post('/api/request/reject_request', {
            requestId: requestId
        })
        .then((res) => {
            var newArray = [...this.state.received_requests];
            newArray.splice(index, 1);
            this.setState({received_requests: newArray, actionsDisabled: false, snackBarMessage: rejectMessage});    
        })
        .catch((err) => {
            console.log(err);
            this.setState({actionsDisabled: false, snackBarMessage: networkErrorMessage});
        });
    }

    handleCancel = (requestId, index) => {
        this.setState({actionsDisabled: true});
        axios.post('/api/request/cancel_request', {
            requestId: requestId
        })
        .then((res) => {
            var newArray = [...this.state.sent_requests];
            newArray.splice(index, 1);
            this.setState({sent_requests: newArray, actionsDisabled: false, snackBarMessage: cancelMessage});    
        })
        .catch((err) => {
            console.log(err)
            this.setState({actionsDisabled: false, snackBarMessage: networkErrorMessage});
        });
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
                    <Tab label={
                        <Badge color='secondary' badgeContent={this.state.sent_requests.length} style={{paddingRight: 10}}>
                            Sent
                        </Badge>
                    } />
                    <Tab label={
                        <Badge color='secondary' badgeContent={this.state.received_requests.length} style={{paddingRight: 10}}>
                            Received
                        </Badge>
                    } />
                </Tabs>
                <div style={{position: 'relative', top: this.state.contentSectionMargin, height: this.state.contentSectionHeight, overflow: 'auto'}}>
                    <div style={{display: 'flex', flexDirection: 'column-reverse', alignItems: 'center',}}>    
                        {this.state.value ? 
                            this.state.received_requests.length ?
                            this.state.received_requests.map((item, index) => 
                                <ReceivedRequestCard
                                key={item._id}
                                id={item._id} 
                                width={this.state.contentSectionWidth}
                                departure = {item.group.departure}true
                                from = {item.group.from}
                                to = {item.group.to}
                                members = {item.group.membersCount}
                                traveler = {item.traveler} 
                                approve = {() => this.handleApprove(item._id, index)}
                                reject = {() => this.handleReject(item._id, index)}
                                disabled={this.state.actionsDisabled}
                                />)
                            :
                                <EmptyMessage primary='No requests received' />
                        : 
                            this.state.sent_requests.length ?
                            this.state.sent_requests.map((item, index) => 
                                <SentRequestCard
                                key={item._id}
                                id={item._id}
                                departure = {item.group.departure}
                                width={this.state.contentSectionWidth}
                                from = {item.group.from}
                                to = {item.group.to}
                                members = {item.group.membersCount}
                                owner = {item.group.owner}
                                cancel = {() => this.handleCancel(item._id, index)}
                                disabled={this.state.actionsDisabled}
                                />)
                            :
                                <EmptyMessage primary='No requests sent' />
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
                <Footer />
            </div>
        )
    }
}