import React from 'react';
import axios from 'axios';
import SearchItemCard from './searchItemCard';

export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.state;

        this.getSearchResults = this.getSearchResults.bind(this);
        this.generateCards = this.generateCards.bind(this);

    }

    componentDidMount() {
        this.getSearchResults(this.state.searchQuery, this.state.searchType);
    }

    shouldComponentUpdate(newProps, newState) {
        if(this.props.state.searchQuery !== newProps.state.searchQuery || this.props.state.searchType !== newProps.state.searchType) {
            this.getSearchResults(newProps.state.searchQuery, newProps.state.searchType);
        }
        
        const cacheDidChange = this.state.searchCache !== this.props.state.searchCache
        this.generateCards();
        return cacheDidChange;
    }

    getSearchResults = async (query, type) => {
        if (query === "") return;
        let response;
        if(type === 'boolean') {
            response = await axios.get(`http://localhost:3001/searchbool?search=${query}`);
        } else if (type === 'free') {
            response = await axios.get(`http://localhost:3001/searchfree?search=${query}`);
        }

        if(response.status === 200) {
            const products = response.data.products;
            this.setState({searchCache: products}); 
            this.props.update('searchCache', products);
        } else {
            throw new Error("Failed to get items");
        }
    }

    generateCards = () => { 
        let listCards;
        if (this.state.searchCache.length === 0) {
            listCards = [<p key="none">No search Results</p>];
        }
        else {
            listCards = this.state.searchCache.map((product) => 
            <SearchItemCard state={this.state} product={product} key={product.id} update={this.props.update}/>
            );
        }
        return listCards; 
    }

    render() {
        return (
            <>
                {this.generateCards()}
            </>
        )
    }
}