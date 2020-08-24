import React from 'react';
import SearchBar from './searchBar';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.state;

    }
    
    render() {
        return (
            <>
                <h1>Welcome to Store!</h1>
                <SearchBar state={this.state} update={this.props.update} />
            </>
        )
    }
}

export default Header;