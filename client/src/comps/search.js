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
var justDate

class Search extends Component{
    constructor(props){
        super(props)
        this.state = {
            fromPlace : 'kgp',
            toPlace :'kgp',
            time: new Date()
        }
    }
    
    setFromPlace = (fromPlace) => { this.setState({fromPlace : fromPlace}) }
    setToPlace = (toPlace) => { this.setState({toPlace : toPlace}) }   
    setDate = (date) => { justDate = date }   
    setTime = (time) => { 
        time = time.split(':')
        var dateWithTime = new Date(justDate[2],months[justDate[0]]-1,justDate[1],time[0],time[1])
        this.setState({time: dateWithTime}) 
    }
    
    sendData = () => {
        console.log(this.state.fromPlace)
        console.log(this.state.toPlace)
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