import React,{ useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import MomentFnsUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

const useStyles = makeStyles({
  grid: {
    width: '50%',
  },
});

function MaterialUIPickers(props) {
  // The first commit of Material-UI
  const [selectedDate, setSelectedDate] = useState(new Date());

  const classes = useStyles();

  function handleDateChange(date) {
    setSelectedDate(new Date(date));
    props.onPassData(new Date(date));  
  }

  return (
    <MuiPickersUtilsProvider utils={MomentFnsUtils}>
      <Grid  className={classes.grid} >
        <KeyboardDatePicker
          margin="normal"
          label="Date of Departure"
          value={selectedDate}
          onChange={handleDateChange}
        />
       </Grid>
    </MuiPickersUtilsProvider>
  );
}

export default MaterialUIPickers;
