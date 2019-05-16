import React,{ Component } from 'react'
import List from './lists'

export default class Notifs extends Component {
    render(){
        return(
            <div>
                <h1 id='no-notifs-plans'>CURRENTLY NO NOTIFICATION</h1>
               <div id='notifs'> 
                    <List
                    msg1='this will be some long notification which will be telling you got a request from '
                    msg2='this will be some long notification which will be telling you got a request from '
                    msg3='this will be some long notification which will be telling you got a request from '
                    />
                </div>
            </div>
        )
    }
}