import React, {Component, useState, useEffect} from 'react';
import { Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions, TextField, Button } from '@material-ui/core';

export default class UpdateLinkDialog extends Component {

  state = {
    link: this.props.link
  };
    
  componentDidUpdate(prevProps) {
    if (prevProps.link !== this.props.link)
      this.setState({link: this.props.link});
  }

  handleChange = (event) => {
    this.setState({link: event.target.value});
  }

  render() {
    return (
        <Dialog open={this.props.open} onClose={this.props.onClose}>
            <DialogTitle id="form-dialog-title">Update Facebook Link</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To allow people to contact you, Please enter your facebook profile link below
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="facebook profile link"
            fullWidth
            value={this.state.link}
            onChange={this.handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.props.onSubmit(this.state.link)} color="primary">
            Update
          </Button>
        </DialogActions>
        </Dialog>
    );
  }

}