import React from 'react';
import { withRouter } from 'react-router'
import axios from 'axios';

class SearchItemCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.state;
        this.product = props.product;
        this.key = props.product.id;

        this.handleClick = this.handleClick.bind(this);
        this.asPrice = this.asPrice.bind(this);
    }

    handleClick = async () => {
        const response = await axios.get(`http://localhost:3001/page?id=${this.key}`);
        console.log("SEARCH CARD HANDLECLICK RESPONSE", response.data);
        this.props.update("itemID", this.key);
        this.props.update("itemCache", response.data);
        this.props.update("searchQuery", response.data.productInfo.tags.join(' ') + "__suggest__");
        this.props.history.push('/product');
    }

    asPrice = priceNumber => { return `$${priceNumber}` } 

    render() {
        return (
            <div onClick={this.handleClick}>
                <h5>{this.product.title}</h5>
                <p>{this.product.shortDescription}</p>
                <h6>{this.asPrice(this.product.price)}</h6>
            </div>
        );
    }
}

export default withRouter(SearchItemCard);