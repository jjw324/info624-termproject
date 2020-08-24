import React from 'react';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.state;
    }

    render() {
        return (
            <>
                <h2>About Info</h2>
                <p>Supported Boolean Search Queries: </p>
                <ul>
                    <li>x</li>
                    <li>NOT x</li>
                    <li>x AND y</li>
                    <li>x OR y</li>
                </ul>
                <h3>Feature Details: </h3>
                <ul>
                    <li>Freetext Search searches the document title, description, and tags</li>
                    <li>Boolean Search only searches the tags</li>
                    <li>Product Suggestions are based on the product you are currently looking at</li>
                </ul>
                <h3>Implementation Details: </h3>
                <ul>
                    <li>React front-end application</li>
                    <li>Node/Express back-end API</li>
                    <li>ElasticSearch Database</li>
                </ul>
                <h4>More information can be found on <a href="https://github.com/jjw324/info624-termproject">GitHub</a> in the readme and Report.pdf</h4>
            </>
        )
    }
}
