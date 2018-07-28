import React, { Component } from 'react';
import PHLAMap from './components/PHLAMap';
import Page from './components/Page'
class App extends Component {
  render() {
    return (
      <Page>
        <p>Hello</p>
        <PHLAMap />
      </Page>
    );
  }
}

export default App;
