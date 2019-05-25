import React, {Component} from 'react';
import { TimePicker, MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';


class PickerDialog extends Component {

    state = {
        time: new Date(),
    }

    sendTime = () => {
        this.props.onTimeChange(this.state.time);
        this.props.onClose();
    }

    setTime = (time) => {
        this.setState({time: time});
    }

    componentDidUpdate(prevProps) {
        if (prevProps.initialTime !== this.props.initialTime)
            this.setState({time: this.props.initialTime});
    }

    render() {
        return (
            <Dialog 
            open={this.props.open} 
            onClose={this.props.onClose}>
                <DialogTitle>Change departure</DialogTitle>
                <DialogContent>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <DatePicker label='Select date' variant='inline'
                        value={this.state.time} 
                        onChange={this.setTime} 
                        />
                        <TimePicker label='Select time' variant='inline'
                        value={this.state.time}
                        onChange={this.setTime}
                        />
                    </MuiPickersUtilsProvider>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.sendTime}>Change</Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default PickerDialog;