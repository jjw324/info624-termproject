import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './App.css';
import Footer from './components/footer'
import Header from './components/header'
import Home from './components/Home';
import Product from './components/Product';
import Search from './components/Search';

export default class App extends React.Component {
  state = {
    searchQuery: '',
    searchType: 'free',
    searchCache: [],
    itemCache: {},
    suggestionTags: {},
    suggestionCache: [],
    itemID: ""
  }

  setParentState = (key, value) => {
    this.setState({[key]: value});
  }
  
  render() {
    return(
      <>
        <Router>
          <Header state={this.state} update={this.setParentState} />
          <Switch>
            <Route exact path="/product">
              <Product state={this.state} update={this.setParentState} />
            </Route>
            <Route exact path="/search">
              <Search state={this.state} update={this.setParentState} />
            </Route>
            <Route exact path="/">
              <Home state={this.state} update={this.setParentState} />
            </Route>
          </Switch>
          <Footer />
        </Router>
      </>
    );
  }
}
