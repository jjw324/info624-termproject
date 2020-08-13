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
    for(let i = 0; i < 60; i++) {
        try {
            await axiosInstance.get('/');
            return;
        } catch (err) {
            console.log(err)
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
    console.log("Connected to database")
    let promises = [];

    filesToUpload.forEach(element => {
        try{
            const filePath = path.join(docDir, element);
            const bodyContent = JSON.parse(fs.readFileSync(filePath));
            promises.push(axiosInstance.post('/products/_doc', bodyContent));
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }
    });

    await Promise.all(promises);
    return;
}

main().then(() => console.log("Database loaded!"));