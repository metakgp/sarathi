import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import { DialogContent, DialogContentText, List, ListItemText, Divider } from '@material-ui/core';

export default function InfoDialog(props) {
    
    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>
                Why Use Sarathi?
            </DialogTitle>
            <DialogContent>
                <DialogContentText> 
                    <List>
                        <ListItemText>
                            Search for groups that matches your travel timings without going through all the groups that is irrelevant to you.
                        </ListItemText>
                        <Divider />
                        <ListItemText>
                            Join as many groups as you want by sending requests to the creator of the group. You can create your own group as well.
                        </ListItemText>
                        <Divider />
                        <ListItemText>
                            Change the status of your group to closed if you do not want to accept more members. A closed group will not be publicly visible.
                        </ListItemText>
                        <Divider />
                        <ListItemText>
                            Get notifications regarding updates to your groups.
                        </ListItemText>
                        <Divider />
                        <ListItemText>
                            Logging In using Facebook allows you to identify people as well as contact them.
                        </ListItemText>
                    </List>
                </DialogContentText>
            </DialogContent>
        </Dialog>
    );

}