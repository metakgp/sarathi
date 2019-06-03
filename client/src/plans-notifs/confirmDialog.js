import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@material-ui/core';

export default function ConfirmDialog(props) {

    return (
        <Dialog 
        open={props.open}
        onClose={props.onClose}
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="alert-dialog-description">
            <DialogTitle id="confirmation-dialog-title">Are you sure?</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                {props.body}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>Cancel</Button>
                <Button onClick={props.onConfirm}>Yes</Button>
            </DialogActions>
        </Dialog>
    )
}