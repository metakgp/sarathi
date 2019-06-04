import React, { Component } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';

const width = () => { 
  if(window.screen.availWidth < 768) return 275
  else return 150
}
const styles = (theme,width) => ({
    formControl: {
      // margin: theme.spacing.unit,
      // minWidth: 150 ,
    },
    selectEmpty: {
      // marginTop: theme.spacing.unit * 2,
    },
  });
  

class MaterialSelect extends Component {
    state={
        labelWidth: 0,
        place: this.props.initialValue ? this.props.initialValue : '',
    }

    handleChange = event => {
        this.setState({ place : event.target.value });
        this.props.onPassData(event.target.value)
      };
    
    render(){
        const { classes } = this.props;
        
        return (
            <div style={{display: 'flex', justifyContent: 'center', margin: 10}}>
              <FormControl className={classes.formControl} style = {{minWidth : width()}}>
                <InputLabel >{this.props.dir}</InputLabel>
                <Select
                  autoWidth={true}
                  value={this.state.place}
                  onChange={this.handleChange}
                >
                  <MenuItem value='KGP'>KGP</MenuItem>
                  <MenuItem value='CCU'>CCU Kolkata Airport</MenuItem>
                  <MenuItem value='railway-station'>Railway Station-KGP</MenuItem>
                  <MenuItem value='howrah'>Howrah</MenuItem>
                </Select>
              </FormControl>
  
            </div>
        );

    }
};

export default withStyles(styles)(MaterialSelect);