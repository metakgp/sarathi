import React from 'react';
import {Typography, Link} from '@material-ui/core';

const footer = (props) => {

    return (
        <div style={{position: "fixed", left: 0, bottom: 0, backgroundColor: '#EEEEEE', width: '100%', textAlign:'center', padding: '15px'}}>
            <Typography variant='body1'>
                Contribute to this project on <Link href='https://github.com/metakgp/sarathi'>Github</Link> | Powered by metakgp with ♥
            </Typography>
        </div>
    )
}

export default footer;