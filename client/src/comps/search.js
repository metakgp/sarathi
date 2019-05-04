import React from 'react'
import Menu from '../basicComps/select'
import DateSelect from '../basicComps/date'
import TimeSelect from '../basicComps/time'
import  '../styles/App.scss'

function Search (){
    return(
        <div className="search">
            <div className="fromTo">
                <h2>From</h2><Menu /><h2>To</h2><Menu />
            </div>
            <DateSelect />
            <TimeSelect />
        </div>
    )
}

export default Search