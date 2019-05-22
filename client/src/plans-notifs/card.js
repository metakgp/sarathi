import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import List from './lists'
import Chip from '@material-ui/core/Chip';
import '../styles/App.scss'
   
export default function SimpleCard (props){
  return(
         <div className='theCard'>
        <Card style={{maxWidth: 600,minWidth:200}}>
          <CardHeader
          style={{background : '#f2f2f2'}}
          title={props.departure}
          subheader={`${props.from} to ${props.to}`} 
          titleTypographyProps={{ align: 'center' }}
          subheaderTypographyProps={{ align: 'center' }}
          />
          <div id='card-contents'>
              <Chip
                color={props.status==='open' ? "primary" : "secondary"}
                label={props.status}
                style={{minWidth: 100,align:'center',marginTop:5}}
              />
              <div className='list-of-ppl'>
                <List
                members = {props.members}
                />
              </div>
              <button>JOIN</button>
            </div> 
        </Card>
      </div>
  )
}

