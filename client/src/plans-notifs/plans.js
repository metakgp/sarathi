import React,{ Component } from 'react'
import Card from './card'
import '../styles/App.scss'

export default class Plans extends Component {
    render(){
        return(
            <div>
                <h1 id='no-notifs-plans'>CURRENTLY NO PLANS</h1>
                <Card />
            </div>
        )
    }
}