import React from 'react'
import Menu from '../basicComps/select'
import DateSelect from '../basicComps/date'
import  '../styles/App.scss'

function Search (){
    return(
        <div className="search">
            <div className="fromTo">
                <h2>From</h2><Menu /><h2>To</h2><Menu />
            </div>
            <DateSelect />
        </div>
    )
}

export default Search