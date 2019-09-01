import React,{ Component } from 'react';
import Card from '../displays/groupCard';
import axios from 'axios';
import  '../styles/App.scss';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add'
import CreateGroupDialog from '../displays/CreateGroupDialog'
import moment from 'moment'
import EmptyMessage from '../displays/emptyMessage';
import SearchPanel from '../inputs/searchPanel';

import {registerPushManager} from '../registerPush';
import { Snackbar, Typography, Link } from '@material-ui/core';
import Footer from '../displays/footer';

const networkErrorMessage = 'Something went wrong. Please check your network connection'
const groupCreatedMessage = 'Group created. Navigate to groups from the drawer to see it'

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
            snackBarMessage: undefined,
            disableAction: false,
            nextUrl: undefined,
        }
        this.updateContentDimensions = this.updateContentDimensions.bind(this);
    }

    componentDidMount() {
        
        // push manager registration
        registerPushManager();

        this.updateContentDimensions();
        window.addEventListener('resize', this.updateContentDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateContentDimensions);
    }

    updateContentDimensions() {
        const margin = document.getElementById('search_section').clientHeight;
        const width = window.innerWidth < 500 ? window.innerWidth : 500;
        const navBarHeight = document.getElementById('appBar').clientHeight;
        this.setState({
            contentSectionHeight: window.innerHeight - navBarHeight, 
            contentSectionWidth: width,
            contentSectionMargin: margin + navBarHeight,
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
        var utcOffset = moment(this.state.time).utcOffset();
        axios.get('/api',{
            params: {
                from : this.state.fromPlace,
                to: this.state.toPlace,
                time: moment(this.state.time).add(utcOffset).format(),
            }
        })
        .then((res) => {
            console.log(res.data);
            console.log(res.data.paging.next);
            var result = res.data.data;
            this.setState({dataCards: result, nextUrl: res.data.paging.next});
            this.collapseSearchPanel();
        })
        .catch((err) => {
            console.log(err);
            this.setState({snackBarMessage: networkErrorMessage});
        })
    }

    sendJoinRequest = (groupId, index) => {
        this.setState({disableAction: true});
        axios.post('/api/request/join_request', {
            from: this.state.fromPlace,
            to: this.state.toPlace,
            time: this.state.time,
            groupId: groupId,
        }).then((res) => {
            console.log(res.data);
            var newArray = [...this.state.dataCards];
            newArray[index].status = 'request_sent';
            this.setState({dataCards: newArray, disableAction: false});
        }).catch((err) => {
            console.log(err);
            this.setState({disableAction: false, snackBarMessage: networkErrorMessage});
        });
    }

    createGroup = (groupInfo) => {
        axios.post('/api/group/create_group', groupInfo)
        .then((res) => {
            this.closeCreateGroupDialog();
        })
        .catch(err => {
            console.log(err);
            this.setState({snackBarMessage: networkErrorMessage});
        })
    }

    loadMoreGroups = () => {
        axios.get(this.state.nextUrl)
        .then(res => {
            var newArray = [...this.state.dataCards];
            newArray.push(...res.data.data);
            this.setState({dataCards: newArray, nextUrl: res.data.paging.next});
        })
        .catch(err => {
            console.log(err);
            this.setState({snackBarMessage: networkErrorMessage});
        });
    }

    openCreateGroupDialog = () => {
        this.setState({showCreateGroupDialog: true});
    }

    closeCreateGroupDialog = () => {
        this.setState({showCreateGroupDialog: false, snackBarMessage: groupCreatedMessage});
    }

    collapseSearchPanel = () => {
        this.setState({showCard: true});
        this.updateContentDimensions();
    }

    expandSearchPanel = () => {
        this.setState({showCard: false});
    }

    snackBarOnClose = () => {
        this.setState({snackBarMessage: undefined});
    }

    render() {
        
        return (
        <div>
            <SearchPanel 
            contentSectionHeight = {this.state.contentSectionHeight}
            fromPlace = {this.state.fromPlace}
            setFromPlace = {this.setFromPlace}
            toPlace = {this.state.toPlace}
            setToPlace = {this.setToPlace}
            time = {this.state.time}
            setDate = {this.setDate}
            setTime =  {this.setTime}
            handleSearch = {this.handleSearch}
            collapse = {this.state.showCard}
            onClick = {this.expandSearchPanel}
            />
                {this.state.showCard ? 
                <div id='card' style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <div style={{height: this.state.contentSectionMargin, margin: 10}}></div>
                    { this.state.dataCards.length ?
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
                                owner = {item.owner}
                                members = {item.members}
                                join={() => this.sendJoinRequest(item._id, index)}
                                disabled={this.state.disableAction}
                                />
                            )
                        })
                    :
                        <EmptyMessage
                        primary='No groups to show' 
                        secondary='Try adjusting the time or create a new group by clicking the button at bottom right corner' />
                    }
                    {
                        this.state.nextUrl ?
                        <Link variant='body1' color='inherit' onClick={this.loadMoreGroups}>Load more groups</Link> : ''
                    }
                </div> : ''}
            <Fab 
            color="primary" 
            aria-label="Add" 
            onClick={this.openCreateGroupDialog}
            style={{margin: 10, position: 'fixed', bottom: 80, right: 10}}>
                <AddIcon />
            </Fab>
            <Snackbar
            open={this.state.snackBarMessage}
            onClose={this.snackBarOnClose}
            autoHideDuration={6000}
            ContentProps={{
                'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{this.state.snackBarMessage}</span>}
            style={{bottom: 100}}
            />
            <CreateGroupDialog 
            open={this.state.showCreateGroupDialog}
            onClose={this.closeCreateGroupDialog} 
            initialValues={{from: this.state.fromPlace, to: this.state.toPlace, time: this.state.time}}   
            onSubmit={this.createGroup}
            />
            <Footer />
        </div>
        )
    }
}

export default Search