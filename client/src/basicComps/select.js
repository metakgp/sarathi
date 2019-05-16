import React from 'react'
import  '../styles/App.scss'

function Menu (){
    return(
        <div className="custom-select">
            <select>
                <option value="0">KGP</option>
                <option value="1">CCU(Kolkata Airport)</option>
                <option value="2">Railway Station-KGP</option>
                <option value="2">Howrah</option>
            </select>
        </div>
    )
}

export default Menu