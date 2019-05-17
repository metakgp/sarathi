import React from 'react'
import  '../styles/App.scss'

function Menu (props){
    const passData = (event) =>{
         props.onPassData(event.target.value)
    }
    
    return(
        <div className="custom-select">
            <select onChange={passData}>
                <option value="kgp">KGP</option>
                <option value="ccu">CCU(Kolkata Airport)</option>
                <option value="railwayStation">Railway Station-KGP</option>
                <option value="howrah">Howrah</option>
            </select>
        </div>
    )
}

export default Menu