import React from 'react'
import Card from '../plans-notifs/card'

export default function Plans() {
    return(
        <div id='plans-page'>
            <div id='plans-buttons'>
                <button>Created Plans</button>
                <button>Joined Plans</button>
            </div>
            <Card />
        </div>
    )
}
