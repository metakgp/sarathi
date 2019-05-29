import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Notifications from '../plans-notifs/notifs'


const samples = [
  {
    message: 'x has agreed to join u from kgp to ccu vx has agreed to join u from kgp to ccu',
    time: '15 min ago'
  },
  {
    message: 'x has agreed to join u from kgp to ccu',
    time: '15 min ago'
  },
  {
    message: 'x has agreed to join u from kgp to ccu',
    time: '15 min ago'
  },
  
]

export default class Example extends Component {
  
  myFunction = () => {
    console.log('here')
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  }

  render() {
    return (
      <div>
         <div className="topnav" id="myTopnav">
                  <a href="/" >
                    <Typography variant="subtitle1">
                        TRAVEL KGP !
                    </Typography>
                  </a>
               <div className='to-right'>
                { /*eslint-disable-next-line*/ }
                  <a href="#" id="hide">1</a>
                  <a href="/requests">
                    <Typography variant="subtitle1">
                          Requests
                    </Typography>  
                  </a>
                  <a href="/groups">
                     <Typography variant="subtitle1">
                          Groups
                      </Typography>
                   </a>
                   { /*eslint-disable-next-line*/ }
                  <a href="javascript:void(0);">
                      <Typography variant="subtitle1">
                              Notifications
                      </Typography>
                  </a>
                  { /*eslint-disable-next-line*/ }
                  <a href="#">
                      <Typography variant="subtitle1">
                         Logout
                      </Typography>
                  </a>
               
                </div>
                { /*eslint-disable-next-line*/ }
              <a href="javascript:void(0);" className="icon" onClick={this.myFunction}>
              <i className="fa fa-bars"></i>
            </a>
        </div>
      </div>
  );
  }

}