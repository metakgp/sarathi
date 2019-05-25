import React from 'react';
import axios from 'axios';
import ReceivedRequestCard from '../plans-notifs/recievedRequests';
import SentRequestCard from '../plans-notifs/sentRequest';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Container from '@material-ui/core/Container';


export default class Requests extends React.Component {

    state = {
        sent_requests: [],
        received_requests: [],
        value: 0
    }

    componentDidMount() {
        axios.get('http://192.168.0.103:5000/user/my_requests?fb_id=2177672832321382')
        .then(res => {
            this.setState({sent_requests: res.data.sent, received_requests: res.data.received})
        })
        .catch(err => {
            console.log(err.data);
        }); 
    }

    handleTabChange = (event, value) => {
        this.setState({value: value});
    }

    getRequests = () => {
        if (this.state.value === 0)
            return this.state.sent_requests;
        return this.state.received_requests;
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
                <Grid item>
                    <Container>
                        {this.state.value ? 
                        this.state.received_requests.map(item => 
                            <ReceivedRequestCard
                            key={item._id}
                            id={item._id} 
                            departure = {item.group.departure}
                            from = {item.group.from}
                            to = {item.group.to}
                            members = {item.group.members.length}
                            traveler = {item.traveler} 
                            />
                        ) :
                        this.state.sent_requests.map(item => 
                            <SentRequestCard
                            key={item._id}
                            id={item._id}
                            departure = {item.group.departure}
                            from = {item.group.from}
                            to = {item.group.to}
                            members = {item.group.members.length}
                            owner = {item.group.owner}
                            />
                        )
                        }
                    </Container>
                </Grid>
            </Grid>
        )
    }
}