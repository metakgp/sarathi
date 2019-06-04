import React,{ Component } from 'react'
import MaterialSelect from '../searchComps/material-select'
import MaterialDate from '../searchComps/materialDate'
import TimeSelect from '../searchComps/time'
import Card from '../plans-notifs/card';
import axios from 'axios';
import  '../styles/App.scss';
import { Paper, Grid, Button, Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add'
import CreateGroupDialog from '../plans-notifs/CreateGroupDialog'
import moment from 'moment'

class Search extends Component{
    constructor(props){
        super(props)
        this.state = {
            fromPlace : 'KGP',
            toPlace :'CCU',
            time: new Date(),
            showCard: false,
            dataCards: [],
            contentSectionHeight: 0,
            contentSectionWidth: 0,
            contentSectionMargin: 0,
            showCreateGroupDialog: false,
        }
        this.updateContentDimensions = this.updateContentDimensions.bind(this);
    }

    componentDidMount() {
        this.updateContentDimensions();
        window.addEventListener('resize', this.updateContentDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateContentDimensions);
    }

    updateContentDimensions() {
        const margin = document.getElementById('search_section').clientHeight;
        const width = window.innerWidth < 500 ? window.innerWidth : 500;
        this.setState({
            contentSectionHeight: window.innerHeight - margin, 
            contentSectionWidth: width,
            contentSectionMargin: margin,
        });
    }
    
    setFromPlace = (fromPlace) => { this.setState({fromPlace : fromPlace}) }
    setToPlace = (toPlace) => { this.setState({toPlace : toPlace}) }   
  
    setTime = (time) => {
        var newDate = new Date(this.state.time.getTime());
        time = new Date(time);
        newDate.setHours(time.getHours());
        newDate.setMinutes(time.getMinutes());
        newDate.setSeconds(time.getSeconds());
        this.setState({time: newDate}); 
    }

    setDate = (date) => {
        var newDate = new Date(this.state.time.getTime());
        newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
        this.setState({time: newDate});
    }
    
    handleSearch = () => {
        // console.log(this.state.fromPlace)
        // console.log(this.state.toPlace)
        var utcOffset = moment(this.state.time).utcOffset();
        axios.get('http://192.168.0.103:5000',{
            params: {
                from : this.state.fromPlace,
                to: this.state.toPlace,
                time: moment(this.state.time).add(utcOffset).format(),
                fb_id: 2177672832321382,
            }
        })
        .then((res) => {
            var result = res.data.data;
            this.setState({dataCards: result, showCard: true});
        })
        .catch((err) => console.log(err)) 
        
        //scrolling down in phone
        if(window.screen.availWidth < 768) window.scrollBy(0,600)
    }

    sendJoinRequest = (groupId, index) => {
        axios.post('http://192.168.0.103:5000/request/join_request?fb_id=2177672832321382', {
            from: this.state.fromPlace,
            to: this.state.toPlace,
            time: this.state.time,
            groupId: groupId,
        }).then((res) => {
            console.log(res.data);
            var newArray = [...this.state.dataCards];
            newArray[index].status = 'request_sent';
            this.setState({dataCards: newArray});
        }).catch((err) => {
            console.log(err);
        });
    }

    createGroup = (groupInfo) => {
        axios.post('http://192.168.0.103:5000/create_group', 
        Object.assign(groupInfo, {name: 'Arib Alam', fb_id: 2177672832321382}))
        .then((res) => {
            this.closeCreateGroupDialog();
        })
        .catch(err => console.log(err))
    }

    openCreateGroupDialog = () => {
        this.setState({showCreateGroupDialog: true});
    }

    closeCreateGroupDialog = () => {
        this.setState({showCreateGroupDialog: false});
    }

    render() {
        
        return (
        <div>
            <Paper id='search_section' style={{position: 'fixed', top: 46, left: 0, width: '100%', zIndex: 1}}>
                <Grid container justify='center' >
                    <Grid item xs={12} sm={6} lg={2}>
                        <MaterialSelect dir='FROM' onPassData={this.setFromPlace} />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={2}>
                        <MaterialSelect dir='TO' onPassData = {this.setToPlace} />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <MaterialDate label='Date of Departure' onPassData = {this.setDate} />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <TimeSelect label='Time of Departure' onPassData = {this.setTime}  />
                    </Grid>
                    <Grid item xs={12} sm={12} lg={2}  style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}>
                        <Button onClick={this.handleSearch} color='primary' size='large' style={{margin: 5}}>
                        Search
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
            <div id='card' style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{height: this.state.contentSectionMargin, margin: 10}}></div>
            { this.state.showCard ?
            this.state.dataCards.map((item, index) => {
                return(
                    <Card
                    key={item._id}
                    id={item._id} 
                    width={this.state.contentSectionWidth}
                    departure = {item.departure}
                    from = {item.from}
                    to = {item.to}
                    status = {item.status}
                    members = {item.members}
                    join={() => this.sendJoinRequest(item._id, index)}
                    />
                )
            }) 
            : ''}
            </div>
            <Fab 
            color="primary" 
            aria-label="Add" 
            onClick={this.openCreateGroupDialog}
            style={{margin: 10, position: 'fixed', bottom: 10, right: 10}}>
                <AddIcon />
            </Fab>
            <CreateGroupDialog 
            open={this.state.showCreateGroupDialog}
            onClose={this.closeCreateGroupDialog} 
            initialValues={{from: this.state.fromPlace, to: this.state.toPlace, time: this.state.time}}   
            onSubmit={this.createGroup}
            />
        </div>
        )
    }
}

export default Search