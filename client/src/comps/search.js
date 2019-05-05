import React from 'react'
import Menu from '../basicComps/select'
import DateSelect from '../basicComps/date'
import TimeSelect from '../basicComps/time'
import  '../styles/App.scss'

function Search (){
    
    return(
        <div className="search">
            <div className="fromTo">
                <div className="menu-des">
                    <h2>From</h2><Menu />
                </div>
                <div className="menu-des">    
                    <h2>To</h2><Menu />
                </div>    
            </div>
            <div className="selectDate">
                <h3>Date of Departure :</h3>
                <DateSelect />
            </div>
            <TimeSelect />
            <em>The above time indicates the time you are leaving from place</em>
            <button onClick={() => console.log('button clicked') }>Search</button>
        </div>
    )
}

export default Search