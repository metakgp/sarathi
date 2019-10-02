import React from 'react';
import EmptyMessage from '../displays/emptyMessage';

export default function invalidPage(props) {

    return (
        <div style={{marginTop: 100}}>
            <EmptyMessage primary='Looks like you typed in the wrong URL' secondary='404 Not Found' />
        </div>
    );

}