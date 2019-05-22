import React,{ Component } from 'react'
import Menu from '../searchComps/select'
import DateSelect from '../searchComps/date'
import TimeSelect from '../searchComps/time'
// import Card from '../plans-notifs/card'
import Card from '../plans-notifs/card';
import CardHeader from '@material-ui/core/CardHeader';
import axios from 'axios';
import  '../styles/App.scss';
import Grid from '@material-ui/core/Grid';


class Search extends Component{
    constructor(props){
        super(props)
        this.state = {
            fromPlace : 'KGP',
            toPlace :'KGP',
            time: new Date(),
            showCard: false,
            dataCards: []
        }
    }
    
    setFromPlace = (fromPlace) => { this.setState({fromPlace : fromPlace}) }
    setToPlace = (toPlace) => { this.setState({toPlace : toPlace}) }   
  
    setTime = (time) => {
        var newDate = new Date(this.state.time.getTime());
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
            }
        })
        .then((res) => {
            var result = res.data.data;
            this.setState({dataCards: result, showCard: true});
        })
        .catch((err) => console.log(err)) 
    }

    render(){
        
        return(
            <div id='homepage'>
            
                <Grid container spacing={16}>
                <Grid item>
                <div className="search">
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
                    <em>The above time indicates the time you are leaving from place</em>
                    <button onClick={this.sendData}>Search</button>
                </div>
                </Grid>
                <Grid item>
                <div id='card'>
                   {(this.state.showCard===true) ?
                     this.state.dataCards.map(item => {
                         return(
                             <Card
                             key={item._id} 
                             departure = {item.departure}
                             from = {item.from}
                             to = {item.to}
                             status = {item.status}
                             members = {item.members}   
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