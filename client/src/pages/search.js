import React,{ Component } from 'react'
import Menu from '../searchComps/select'
import DateSelect from '../searchComps/date'
import TimeSelect from '../searchComps/time'
// import Card from '../plans-notifs/card'
import Card from '../plans-notifs/card';
import axios from 'axios';
import  '../styles/App.scss';
import Grid from '@material-ui/core/Grid';
import { List, ListItem } from '@material-ui/core';

<<<<<<< HEAD

=======
>>>>>>> planning to change the search page
class Search extends Component{
    constructor(props){
        super(props)
        this.state = {
            fromPlace : 'KGP',
            toPlace :'KGP',
            time: new Date(),
<<<<<<< HEAD
            showCard: false,
            dataCards: [],
            contentSectionHeight: 0,
=======
            dataCards: []
>>>>>>> planning to change the search page
        }
        this.updateContentSectionHeight = this.updateContentSectionHeight.bind(this);
    }

    componentDidMount() {
        this.updateContentSectionHeight();
        window.addEventListener('resize', this.updateContentSectionHeight);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateContentSectionHeight);
    }

    updateContentSectionHeight() {
        this.setState({contentSectionHeight: window.innerHeight});
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
    
    sendData = () => {
        // console.log(this.state.fromPlace)
        // console.log(this.state.toPlace)
        // console.log(this.state.time)
        axios.get('http://192.168.0.103:5000',{
            params: {
                from : this.state.fromPlace,
                to: this.state.toPlace,
                time: this.state.time,
                fb_id: 2177672832321382,
            }
        })
        .then((res) => {
            var result = res.data.data;
            this.setState({dataCards: result, showCard: true});
        })
        .catch((err) => console.log(err)) 
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

    render(){
        
        return(
<<<<<<< HEAD
            <div id='homepage'>
            
                <Grid container spacing={5}>
                <Grid item>
                <div className="search" style={{zIndex: 1}}>
=======
            <div>
                <Grid container>
                <div className="search">
>>>>>>> planning to change the search page
                    <div className="fromTo">
                        <div className="menu-des">
                            <h2>From</h2><Menu onPassData={this.setFromPlace} />
                        </div>
                        <div className="menu-des">    
                            <h2>To</h2><Menu onPassData = {this.setToPlace} />
                        </div>    
                    </div>
                    <div className="selectDate">
                        <h3>Date of Departure :</h3>
                        <DateSelect onPassData = {this.setDate} />
                    </div>
                    <TimeSelect onPassData={this.setTime} />
                    <button onClick={this.sendData}>Search</button>
                </div>
                </Grid>
                <Grid item xs style={{height: this.state.contentSectionHeight, overflowY: 'scroll', overflowX: 'hidden'}}>
                <div id='card'>
                   {(this.state.showCard===true) ?
                     this.state.dataCards.map((item, index) => {
                         return(
                             <Card
                             key={item._id}
                             id={item._id} 
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
                </Grid>
                </Grid>
            </div>
        )
    }
}

export default Search