const express = require('express');
const axios = require('axios');
require('dotenv').config();
const app = express();

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

// FUNCTIONS

// Returns document source 
async function getByID(id) {
    response = await axiosInstance.get(`/_doc/${id}`);
    if (response.statusCode === 200) {
        return response.body._source;
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
    const queryString = req.query.search;
    
    if (typeof queryString !== "string" || queryString.trim() === "") {
        res.status(400).send("Bad query");
    }

    const dbResponse = await axiosInstance.get(); // TODO
    const hits = dbResponse.body.hits.hits; // TODO: Sort hits by score?

    hits.forEach(element => {
        const page = getByID(element._id);
        retObj.products.push({
            title: page.productInfo.title,
            shortDescription: page.productInfo.shortDescription,
            price: page.productInfo.price,
            img: page.productInfo.img,
            createdBy: page.meta.createdBy,
            id: element._id
        });
    });

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

    const dbResponse = await axiosInstance.get(); // TODO
    const hits = dbResponse.body.hits.hits;

    hits.forEach(element => {
        const page = getByID(element._id);
        retObj.products.push({
            title: page.productInfo.title,
            shortDescription: page.productInfo.shortDescription,
            price: page.productInfo.price,
            img: page.productInfo.img,
            createdBy: page.meta.createdBy,
            id: element._id
        });
    });

    res.statusCode(200).send(retObj);

});

// Query for a specific product page
app.get('/page', async (req, res) => {
    const productID = req.query.id;
    
    if (typeof productID !== "string") {
        res.status(400).send("Bad query");
    }

    const dbResponse = getByID(productID);
    
    // Sends the exact product page
    res.status(200).send(dbResponse)

});

app.get('/suggest', async (req, res) => {
    const suggestionTags = req.query.tags;

    if (typeof suggestionTags !== "string") {
        res.status(400).send("Bad query");
    }

    // TODO: Get suggested products

});

// LISTEN
app.listen(port, () => {
    console.log(`API server listening on ${port}`);
});
