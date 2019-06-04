import React from 'react';
import Typography from '@material-ui/core/Typography';

export default function EmptyMessage(props) {

    return (
        <div style={{color: '#dfdfdf', margin: 20}}> 
            <Typography 
            variant='h2' 
            color='inherit'
            align='center'>
            {props.children}
            </Typography>
        </div>
    );

}