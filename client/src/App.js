import React, { Component } from 'react';
import './App.css';
import Dashboard from './components/Dashboard.jsx'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Admin from "./components/Admin";


class App extends Component {

  state = {
    hasError: false,
    showSpinner: true
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    console.log('some error has occured');
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    console.log(error, info);
  }

  hideSpinner = () => {
    this.setState({showSpinner: false});
  };

  render() {
    return (
      <Router>
        <div className="App">
            <Switch>
            <Route path="/admin">
              <Admin/>
            </Route>
            <Route path="/">
              <Dashboard hideSpinner={this.hideSpinner} showSpinner={this.state.showSpinner} />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
