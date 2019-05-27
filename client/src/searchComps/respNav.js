import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';

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
                    <Typography variant="h6">
                        TRAVEL KGP !
                    </Typography>
                  </a>
               <div className='to-right'>
                  <a href="#" id="hide">1</a>
                  <a href="/requests">
                    <Typography variant="h6">
                          Requests
                    </Typography>  
                  </a>
                  <a href="/groups">
                     <Typography variant="h6">
                          Groups
                      </Typography>
                   </a>
                  <a href="/notifications">
                    <Typography variant="h6">
                            Notifications
                        </Typography>
                  </a>
                  <a href="#">
                      <Typography variant="h6">
                         Logout
                      </Typography>
                  </a>
               
                </div>
              <a href="javascript:void(0);" className="icon" onClick={this.myFunction}>
              <i className="fa fa-bars"></i>
            </a>
        </div>
      </div>
    );
  }

}