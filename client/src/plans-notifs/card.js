import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import List from './lists'
import '../styles/App.scss'

const styles = {
  card: {
    minWidth: 100 ,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
};


function SimpleCard(props) {
  const { classes } = props;
  
  function handleStatus (status){
    
    if(!status)
      return <span className='closed'>CLOSED</span>
    else
      return <span className='open'>OPEN</span>  
  }
    

  return (
    <Card className={classes.card}>
      <CardContent>
        <div className="details-in-card ">
           <div className='time-places'>
              <h3>Time : 23:00</h3>
              <h3>KGP  to CCU</h3>
            </div>
           <div className='status'>
              <p>Status : {handleStatus()}</p>
           </div>
           <div className='list-of-ppl'>
            <List
              msg1='person-1'
              msg2='person-1'
              msg3='person-1'
           />
            <button>JOIN</button> 
           </div>
         </div>
            
            
        
      </CardContent>
      </Card>
  );
}


export default withStyles(styles)(SimpleCard);
