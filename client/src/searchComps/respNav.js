import React, { Component } from 'react';
 
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
                  <a href="/" >TRAVEL KGP</a>
               <div className='to-right'>
                  <a href="#" id="hide">1</a>
                  <a href="/requests">Requests</a>
                  <a href="/groups">Groups</a>
                  <a href="/notifications">Notifications</a>
                  <a href="#">Logout</a>
               
                </div>
              <a href="javascript:void(0);" className="icon" onClick={this.myFunction}>
              <i className="fa fa-bars"></i>
            </a>
        </div>
      </div>
    );
  }

}