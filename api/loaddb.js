// Helper file to preload elasticsearch before starting the API server

const fs = require('fs');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const docDir = path.join(__dirname, "db");
const es_host = process.env.ES_HOST;
const es_port = process.env.ES_PORT;

const axiosInstance = axios.create({
    baseURL: `http://${es_host}:${es_port}`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

async function connectToDatabase() {
    console.log(`Connecting to ElasticSearch on host:${es_host} and port:${es_port}`);

    for(let i = 0; i < 60; i++) {
        try {
            await axiosInstance.get('/');
            return;
        } catch (err) {
            console.log("Waiting for Database...");
            await new Promise(r => setTimeout(r, 5000))
        }
    }
    throw new Error("Unable to connect to ElasticSearch. Is it running?");
}

async function main() {
    const filesToUpload = fs.readdirSync(docDir);
    console.log("Files to upload: ", filesToUpload);
    console.log("Connecting to the database...\n(times out after 5 minutes)");
    await connectToDatabase();
    console.log("Connected to database");
    try {
        await axiosInstance.delete('/products');
        console.log('Existing products removed (prevents duplicate data on each startup)');
    } catch (err) {
        console.log('Attempted to clear the database index and failed. If this your first time running, then do not worry. If not, you may see duplicate data.');
    }
    let promises = [];

    filesToUpload.forEach(element => {
        try{
            const filePath = path.join(docDir, element);
            const bodyContent = JSON.parse(fs.readFileSync(filePath));
            promises.push(axiosInstance.post('/products/_doc', bodyContent));
        } catch (err) {
            console.log("Error: ", err);
            throw new Error(err);
        }
    });
    try {
        await Promise.all(promises);
    } catch (err) {
        console.dir(err, {depth: 10});
    }
    return;
}

main().then(() => console.log("Database loaded!"));