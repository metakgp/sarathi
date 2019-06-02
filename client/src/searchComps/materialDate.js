import React,{ useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import MomentFnsUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

// const useStyles = makeStyles({
//   grid: {
//     width: '50%',
//   },
// });

function MaterialUIPickers(props) {
  // The first commit of Material-UI
  const [selectedDate, setSelectedDate] = useState(props.initialValue ? props.initialValue : new Date());

  function handleDateChange(date) {
    setSelectedDate(new Date(date));
    props.onPassData(new Date(date));  
  }

  return (
    <div style={{display: 'flex', justifyContent: 'center', margin: 10}}>
    <MuiPickersUtilsProvider utils={MomentFnsUtils}>
        <KeyboardDatePicker
          label={props.label}
          value={selectedDate}
          onChange={handleDateChange}
        />
    </MuiPickersUtilsProvider>
    </div>
  );
}

export default MaterialUIPickers;
