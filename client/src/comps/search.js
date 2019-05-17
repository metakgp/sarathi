import React,{ Component } from 'react'
import Menu from '../basicComps/select'
import DateSelect from '../basicComps/date'
import TimeSelect from '../basicComps/time'
import  '../styles/App.scss'

var months = {
    Jan : 1,
    Feb : 2,
    Mar : 3,
    Apr : 4,
    May : 5,
    Jun : 6,
    Jul : 7,
    Aug : 8,
    Sep : 9,
    Oct : 10,
    Nov : 11,
    Dec : 12
}

class Search extends Component{
    constructor(props){
        super(props)
        this.state = {
            fromPlace : 'kgp',
            toPlace :'kgp',
            date: new Date(),
            time: new Date().toLocaleTimeString()
        }
    }
    
    setFromPlace = (fromPlace) => { this.setState({fromPlace : fromPlace}) }
    setToPlace = (toPlace) => { this.setState({toPlace : toPlace}) }   
    setDate = (date) => {
        var dateObj = new Date(date[2],months[date[0]],date[1])
        this.setState({date: dateObj}) 
    }   
    setTime = (time) => { this.setState({time: time}) }

    sendData = () => {
        console.log(this.state.fromPlace)
        console.log(this.state.toPlace)
        console.log(this.state.date)
        console.log(this.state.time)
        //this data will be sent to the backend via axios
    }

    render(){
        return(
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
        )
    }
}

export default Search