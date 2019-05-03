import React, { Component } from 'react';
import Navbar from './basicComps/navbar'
import Search from './comps/search'

class App extends Component {
  render() {
    return (
      <div>
        <Navbar name="Kaushik" /><br />
        <Search />
      </div>
    );
  }
}

export default App;
