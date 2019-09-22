import React from 'react';
import {Typography, Link} from '@material-ui/core';

const footer = (props) => {

    return (
        <div id="footer" style={{position: "fixed", left: 0, right: 0, bottom: 0, backgroundColor: '#EEEEEE', textAlign:'center', padding: '1rem'}}>
            <Typography variant='body1'>
                Contribute to this project on <Link href='https://github.com/metakgp/sarathi'>Github</Link> | 
                Powered by <Link href='https://metakgp.github.io/'>metakgp</Link> with ♥
            </Typography>
        </div>
    )
}

export default footer;