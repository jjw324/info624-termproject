import React from 'react';
import Search from './Search';

export default class Product extends React.Component {
    constructor(props) {
        super(props);

        this.state = props.state;
    }

    render() {
        return (
            <>
                <h1>{this.props.state.itemCache.productInfo.title} for ${this.props.state.itemCache.productInfo.price}</h1>
                <h2>in {this.props.state.itemCache.productInfo.category}</h2>
                <h3>Listed By: {this.props.state.itemCache.meta.createdBy}</h3>
                <p>{this.props.state.itemCache.productInfo.description}</p>
                <hr />
                <h2>More like this</h2>
                <Search state={this.props.state} update={this.props.update} />   
            </>
        )
    }
}