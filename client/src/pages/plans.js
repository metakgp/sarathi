import React from 'react';
import axios from 'axios';
import Card from '../plans-notifs/card';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Container from '@material-ui/core/Container';


export default class Groups extends React.Component {

    state = {
        created_groups: [],
        joined_groups: [],
        value: 0,
    }

    componentDidMount() {
        axios.get('http://192.168.0.103:5000/user/my_groups?fb_id=2177672832321382')
        .then(res => {
            this.setState({created_groups: res.data.created, joined_groups: res.data.joined})
        })
        .catch(err => {
            console.log(err.data);
        }); 
    }

    handleTabChange = (event, value) => {
        this.setState({value: value});
    }

    getGroups = () => {
        if (this.state.value === 0)
            return this.state.created_groups;
        return this.state.joined_groups;
    }

    removeGroup = () => {
        console.log("Group to be removed");
    }

    changeTime = () => {
        console.log("Time to be changed");
    }

    render() {
        return (
            <Grid container direction='column' alignItems='center' spacing={5}>
                <Grid item>
                    <Tabs 
                    value={this.state.value}
                    onChange={this.handleTabChange} 
                    textColor='primary' 
                    indicatorColor='primary' 
                    centered>
                        <Tab label='Created' />
                        <Tab label='Joined' />
                    </Tabs>
                </Grid>
                <Grid item>
                    <Container>
                        {this.getGroups().map(item => 
                            <Card
                            key={item._id}
                            id={item._id} 
                            departure = {item.departure}
                            from = {item.from}
                            to = {item.to}
                            status = {item.status}
                            members = {item.members}
                            hasButton = {true}
                            buttons={[
                                {text: 'change time', onClick: this.changeTime},
                                {text: 'remove', onClick: this.removeGroup},
                            ]}
                            onButtonClick = {this.sendJoinRequest} 
                            />
                        )}
                    </Container>
                </Grid>
            </Grid>
            // <Grid container direction='column' justify='center' spacing={5} >
            //     <Grid item>
            //         Item 1
            //     </Grid>
            //     <Grid item>
            //         Item 2
            //     </Grid>
            // </Grid>
            // <Grid container direction='column' spacing={5}>
            // <Grid item>
                // <Tabs 
                // value={this.state.value}
                // onChange={this.handleTabChange} 
                // textColor='primary' 
                // indicatorColor='primary' 
                // centered>
                //     <Tab label='Created' />
                //     <Tab label='Joined' />
                // </Tabs>
            // </Grid>
            // <Grid>
            //     <Container maxWidth='sm'>
            //         <div >
                        // {this.getGroups().map(item => 
                        //     <Card
                        //     key={item._id}
                        //     id={item._id} 
                        //     departure = {item.departure}
                        //     from = {item.from}
                        //     to = {item.to}
                        //     status = {item.status}
                        //     members = {item.members}
                        //     hasButton = {false}
                        //     onButtonClick = {this.sendJoinRequest} 
                        //     />
                        // )}
            //         </div>
            //     </Container>
            // </Grid>
            // </Grid>
        )
    }
}