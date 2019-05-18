import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import List from './lists'
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import '../styles/App.scss'


export default function SimpleCard (){
  return(
    <div className='theCard'>
      <Card style={{maxWidth: 600,minWidth:200}}>
        <CardHeader
        style={{background : '#f2f2f2'}}
        title='22:30'
        subheader='KGP TO CCU'
        titleTypographyProps={{ align: 'center' }}
        subheaderTypographyProps={{ align: 'center' }}
         />
        <Grid container spacing={12}>
          <Grid item xs={3} md={5}></Grid>
          <Grid item xs={5} md={3}>
            <Chip
            color='secondary'
            label='CLOSED'
          style={{minWidth: 100,align:'center',marginTop:5}}
            />
            <div className='list-of-ppl'>
              <List />
            </div>
            <button className='joinBtn'>JOIN</button>
                   
            </Grid>
            <Grid item xs={4} md={4}></Grid>
        </Grid>
           
         </Card>
    </div>
  )
}

