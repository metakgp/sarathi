import React from 'react';
import axios from 'axios';
import ReceivedRequestCard from '../plans-notifs/recievedRequests';
import SentRequestCard from '../plans-notifs/sentRequest';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Container from '@material-ui/core/Container';


export default class Requests extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sent_requests: [],
            received_requests: [],
            value: 0,
            count: true,
            contentSectionHeight: 0,
        }
        this.updateContentSectionHeight = this.updateContentSectionHeight.bind(this);
    }

    componentDidMount() {
        axios.get('http://192.168.0.103:5000/user/my_requests?fb_id=2177672832321382')
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
        this.setState({contentSectionHeight: window.innerHeight - 88});
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
        axios.post('http://192.168.0.103:5000/request/approve_request', {
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
        axios.post('http://192.168.0.103:5000/request/reject_request', {
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
        axios.post('http://192.168.0.103:5000/request/cancel_request', {
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
            <Grid container direction='column' alignItems='center' spacing={5}>
                <Grid item>
                    <Tabs 
                    value={this.state.value}
                    onChange={this.handleTabChange} 
                    textColor='primary' 
                    indicatorColor='primary' 
                    centered>
                        <Tab label='Sent' />
                        <Tab label='Received' />
                    </Tabs>
                </Grid>
                <Grid item style={{width: '100%', height: this.state.contentSectionHeight, overflowY: 'scroll', overflowX: 'hidden'}}>
                    <Container style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>    
                        {this.state.value ? 
                        this.state.received_requests.map((item, index) => 
                            <ReceivedRequestCard
                            key={item._id}
                            id={item._id} 
                            departure = {item.group.departure}
                            from = {item.group.from}
                            to = {item.group.to}
                            members = {item.group.membersCount}
                            traveler = {item.traveler} 
                            approve = {() => this.handleApprove(item._id, index)}
                            reject = {() => this.handleReject(item._id, index)}
                            />
                        ) :
                        this.state.sent_requests.map((item, index) => 
                            <SentRequestCard
                            key={item._id}
                            id={item._id}
                            departure = {item.group.departure}
                            from = {item.group.from}
                            to = {item.group.to}
                            members = {item.group.membersCount}
                            owner = {item.group.owner.name}
                            cancel = {() => this.handleCancel(item._id, index)}
                            />
                        )
                        }
                    </Container>
                </Grid>
            </Grid>
        )
    }
}