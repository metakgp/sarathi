import React, {Component} from 'react';
import moment from 'moment'
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import {ListItemAvatar, Avatar, Grid, ListSubheader, Chip, Button} from '@material-ui/core'

import MaterialSelect from '../searchComps/material-select'
import DateSelect from '../searchComps/materialDate'
import TimeSelect from '../searchComps/time'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class CreateGroupDialog extends Component {

  state = {
    from: this.props.initialValues.from,
    to: this.props.initialValues.to,
    departure: this.props.initialValues.time,
    boardingTime: this.props.initialValues.time,
  }

  componentDidUpdate(prevProps) {
    if (prevProps.initialValues !== this.props.initialValues)
      this.setState({
        from: this.props.initialValues.from, 
        to: this.props.initialValues.to, 
        departure: this.props.initialValues.time,
        boardingTime: this.props.initialValues.time,
      });
  }

  setFrom = (from) => {
    this.setState({from: from});
  }

  setTo = (to) => {
    this.setState({to: to});
  }

  setBoardingTime = (time) => {
    this.setState({boardingTime: time});
  }

  setTime = (time) => {
    var newDate = new Date(this.state.departure.getTime());
    time = new Date(time);
    newDate.setHours(time.getHours());
    newDate.setMinutes(time.getMinutes());
    newDate.setSeconds(time.getSeconds());
    this.setState({departure: newDate}); 
  }

  setDate = (date) => {
      var newDate = new Date(this.state.departure.getTime());
      newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
      this.setState({departure: newDate});
  }

  render() {
    return (
      <div>
        <Dialog fullScreen open={this.props.open} onClose={this.props.onClose} TransitionComponent={Transition}>
          <AppBar style={{position: 'relative'}}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={this.props.onClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" style={{marginLeft: 10}}>
                Create Group
              </Typography>
            </Toolbar>
          </AppBar>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Grid container>
            <Grid item xs={12} lg={6}>
              <MaterialSelect 
              dir='FROM' 
              initialValue={this.state.from}
              onPassData={this.setFrom} />
            </Grid>
            <Grid item xs={12} lg={6}>
              <MaterialSelect 
              dir='TO' 
              initialValue={this.state.to}
              onPassData={this.setTo} />
            </Grid>
            <Grid item xs={12} lg={6}>
              <DateSelect 
              label='Date of Departure' 
              initialValue={this.state.departure}
              onPassData={this.setDate} />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TimeSelect 
              label='Time of Departure' 
              initialValue={this.state.departure}
              onPassData={this.setTime} />
            </Grid>
            <Grid item xs={12}>
              <TimeSelect label='Time of Boarding (optional)' initialValue={this.state.boardingTime} />
            </Grid>
            <Grid item xs={12} style={{display: 'flex', justifyContent: 'center', margin: 20}}>
              <Button 
              color='primary' 
              size='large' 
              onClick={() => this.props.onSubmit(this.state)}>
              Create Group
              </Button>
            </Grid>
          </Grid>
          </div>
        </Dialog>
      </div>
    );
  }
}

export default CreateGroupDialog;