import React from 'react'
import { withRouter } from 'react-router'

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.state;
        this.submitQuery = false;

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (event) => {
        event.preventDefault();
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({ [name]: value });
    }

    handleSubmit = (event) => {
        event.preventDefault();

        for (const key in this.state) {
            if (this.state[key] !== this.props.state[key]) {
                this.props.update(key, this.state[key]);
            }
        }

        this.props.history.push('/search');
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>Search</label>
                    <input type='text' id='searchQuery' name='searchQuery' onChange={this.handleChange} value={this.state.searchQuery}></input> <br />
                    <label>Search Type</label> <br />
                    <input type='radio' id='free' name='searchType' value='free' onChange={this.handleChange} checked={this.state.searchType === 'free'}></input>
                    <label>Freetext</label>
                    <input type='radio' id='boolean' name='searchType' value='boolean' onChange={this.handleChange} checked={this.state.searchType === 'boolean'}></input>
                    <label>Boolean</label> <br />
                    <input type='submit' value='submit' />
                </form>
            </div>
        )
    }
}

export default withRouter(SearchBar);
