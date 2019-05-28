import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { StickyContainer, Sticky } from 'react-sticky';


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
                  <a href="/notifications">
                    <Typography variant="subtitle1">
                            Notifications
                        </Typography>
                  </a>
                  <a href="#">
                      <Typography variant="subtitle1">
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