import React, { Component } from 'react';
import MaterialSelect from '../searchComps/material-select'
import MaterialDate from '../searchComps/materialDate'
import TimeSelect from '../searchComps/time'
import axios from 'axios'

class NewSearch extends Component {
    constructor(props){
        super(props)
        this.state = {
            fromPlace : 'KGP',
            toPlace :'KGP',
            time: new Date(),
        }
    }
   
    setFromPlace = (fromPlace) => { this.setState({fromPlace : fromPlace}) }
    
    setToPlace = (toPlace) => { this.setState({toPlace : toPlace}) }   
    
    setDate = (date) => {
        var newDate = new Date(this.state.time.getTime());
        newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
        this.setState({time: newDate});

    }
    
    setTime = (time) => {
        var newDate = new Date(this.state.time.getTime())
        newDate.setHours(time.getHours());
        newDate.setMinutes(time.getMinutes());
        newDate.setSeconds(time.getSeconds());
        this.setState({time: newDate}); 
    }
    
    handleSearch = () => {
        // console.log(this.state.fromPlace)
        // console.log(this.state.toPlace)
        // console.log(this.state.time)

        axios.get('http://localhost:5000',{
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

    render() {
        return (
            <div>
                <div id='NewSearch'>
                    <div id='NewSeachEle' className='fromto'>
                        <MaterialSelect dir='FROM' onPassData={this.setFromPlace} />
                    </div>
                    <div id='NewSeachEle' className='fromto'>
                        <MaterialSelect dir='TO' onPassData = {this.setToPlace} />
                    </div>
                    <div id='NewSeachEle' >
                        <MaterialDate onPassData = {this.setDate} />
                    </div>
                    <div id='NewSeachEle'>
                        <TimeSelect onPassData = {this.setTime}  />
                    </div>  
                </div>
                <button onClick={this.handleSearch} id='search-btn'>Search</button>
            </div>
        );
    }
}

export default NewSearch;