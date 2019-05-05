import 'date-fns';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, TimePicker} from 'material-ui-pickers';

const styles = {
  grid: {
    width: '60%',
  },
};

class MaterialUIPickers extends React.Component {
  state = {
    // The first commit of Material-UI
    selectedDate:  Date('2014-08-18T21:11:54'),
  };

  handleDateChange = date => {
    this.setState({ selectedDate: date });
    var selectedTime = String(date).split(' ')[4]
    console.log(selectedTime)
  };

  render() {
    const { selectedDate } = this.state;

    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <TimePicker
            margin="normal"
            label="Time of Departure"
            value={selectedDate}
            onChange={this.handleDateChange}
            
          />
         </MuiPickersUtilsProvider>
    );
  }
}

MaterialUIPickers.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MaterialUIPickers);
