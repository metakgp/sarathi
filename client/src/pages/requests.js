import React from 'react';
import axios from 'axios';
import ReceivedRequestCard from '../plans-notifs/recievedRequests';
import SentRequestCard from '../plans-notifs/sentRequest';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import EmptyMessage from '../plans-notifs/emptyMessage';


export default class Requests extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sent_requests: [],
            received_requests: [],
            value: 0,
            count: true,
            contentSectionHeight: 0,
            contentSectionWidth: 0,
        }
        this.updateContentSectionHeight = this.updateContentSectionHeight.bind(this);
    }

    componentDidMount() {
        axios.get('/api/user/requests?fb_id=1234')
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
        this.setState({contentSectionHeight: window.innerHeight - 46 - 48, contentSectionWidth: width});
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
        axios.post('/api/request/approve_request', {
            requestId: requestId
        })
        .then((res) => {
            var newArray = [...this.state.received_requests];
            this.updateMembers(newArray, index);
            newArray.splice(index, 1);
            this.setState({received_requests: newArray});
        })
        .catch((err) => {
            console.log(err);
        });
    }

    handleReject = (requestId, index) => {
        axios.post('/api/request/reject_request', {
            requestId: requestId
        })
        .then((res) => {
            var newArray = [...this.state.received_requests];
            newArray.splice(index, 1);
            this.setState({received_requests: newArray});    
        })
        .catch((err) => {
            console.log(err)
        });
    }

    handleCancel = (requestId, index) => {
        axios.post('/api/request/cancel_request', {
            requestId: requestId
        })
        .then((res) => {
            var newArray = [...this.state.sent_requests];
            newArray.splice(index, 1);
            this.setState({sent_requests: newArray});    
        })
        .catch((err) => {
            console.log(err)
        });
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
                    <Tab label='Sent' />
                    <Tab label='Received' />
                </Tabs>
                <div style={{position: 'relative', top: '48px', height: this.state.contentSectionHeight, overflow: 'auto'}}>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center',}}>    
                        {this.state.value ? 
                            this.state.received_requests.length ?
                            this.state.received_requests.map((item, index) => 
                                <ReceivedRequestCard
                                key={item._id}
                                id={item._id} 
                                width={this.state.contentSectionWidth}
                                departure = {item.group.departure}
                                from = {item.group.from}
                                to = {item.group.to}
                                members = {item.group.membersCount}
                                traveler = {item.traveler} 
                                approve = {() => this.handleApprove(item._id, index)}
                                reject = {() => this.handleReject(item._id, index)}
                                />)
                            :
                                <EmptyMessage>No requests received</EmptyMessage>
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
                                />)
                            :
                                <EmptyMessage>No requests sent</EmptyMessage>
                        }
                    </div>
                </div>
            </div>
        )
    }
}