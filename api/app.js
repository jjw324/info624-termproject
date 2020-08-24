const express = require('express');
const axios = require('axios');
require('dotenv').config();
const app = express();
const cors = require('cors');

const port = process.env.API_PORT;
const es_host = process.env.ES_HOST;
const es_port = process.env.ES_PORT;

const axiosInstance = axios.create({
    baseURL: `http://${es_host}:${es_port}/products`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// MIDDLEWARES

app.use(cors());

// FUNCTIONS

// Returns document source 
async function getByID(id) {
    const response = await axiosInstance.get(`/_doc/${id}`);
    if (response.status === 200) {
        return response.data._source;
    } else {
        throw new Error('Bad response from database', response);
    }
}

// ROUTES
app.get('/', (req, res) => {
    res.send('Welcome to the API test page');
});

// Query for products that match a freetext search query
app.get('/searchfree', async (req, res) => {
    let queryString = req.query.search;
    const suggest = queryString.includes("__suggest__");
    queryString.replace('__suggest__', '');
    let retObj = {
        products: []
    };

    if (typeof queryString !== "string" || queryString.trim() === "") {
        res.status(400).send("Bad query");
    }

    const reqBody = JSON.stringify({
        query : {
            multi_match: {
                query: queryString,
                fields: ["productInfo.title", "productInfo.description", "productInfo.tags"]
            }
        }
    });

    const dbResponse = await axiosInstance.get('/_search', { data: reqBody });
    const hits = [...dbResponse.data.hits.hits].sort((a , b) => a._score < b._score);
    
    if(suggest) hits.shift();
    

    hits.forEach(element => {
        retObj.products.push({
            title: element._source.productInfo.title,
            shortDescription: element._source.productInfo.shortDescription,
            price: element._source.productInfo.price,
            img: element._source.productInfo.img,
            createdBy: element._source.meta.createdBy,
            id: element._id
        });
    });

    res.status(200).send(retObj);
});

// Query for products that match a boolean search query
app.get('/searchbool', async (req, res) => {
    const queryString = req.query.search;
    let retObj = {
        products: []
    };

    if (typeof queryString !== "string" || queryString.trim() === "") {
        res.status(400).send("Bad query");
    }

    // Parse out boolean search query
    const queryTokens = queryString.split(' ');

    const query = JSON.stringify({
        "query": {
            "match_all": {}
        }
    });

    const dbResponse = await axiosInstance.get('/_search', query);
    const hits = dbResponse.data.hits.hits;

    hits.forEach(element => {
        retObj.products.push({
            title: element._source.productInfo.title,
            shortDescription: element._source.productInfo.shortDescription,
            price: element._source.productInfo.price,
            img: element._source.productInfo.img,
            createdBy: element._source.meta.createdBy,
            id: element._id,
            tags: element._source.productInfo.tags
        });
    });

    if (queryTokens.length === 1) {
        retObj.products = retObj.products.filter(item => item.tags.includes(queryTokens[0]));
    } else if (queryTokens.length === 2) {
        retObj.products = retObj.products.filter(item => !item.tags.includes(queryTokens[0]));
    } else if (queryTokens.length === 3) {
        if (queryTokens[1] === 'AND') {
            retObj.products = retObj.products.filter(item => item.tags.includes(queryTokens[0]) && item.tags.includes(queryTokens[2]));
        } else if (queryTokens[1] === 'OR') {
            retObj.products = retObj.products.filter(item => item.tags.includes(queryTokens[0]) || item.tags.includes(queryTokens[2]));
        } else retObj.products = [];
    }

    res.status(200).send(retObj);

});

// Query for a specific product page
app.get('/page', async (req, res) => {
    const productID = req.query.id;

    if (typeof productID !== "string") {
        res.status(400).send("Bad query");
    }

    const dbResponse = await getByID(productID);

    // Sends the exact product page
    res.status(200).send(dbResponse)

});

app.get('/suggest', async (req, res) => {
    const suggestionTags = JSON.parse(req.query.tags);

    if (typeof suggestionTags !== "string") {
        res.status(400).send("Bad query");
    }

    // TODO: Get suggested products

});

// LISTEN
app.listen(port, () => {
    console.log(`API server listening on ${port}`);
});
