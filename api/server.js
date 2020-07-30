const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send("Hello, World!");
});

app.get('/api', (req, res) => {
    res.send("your query was X");
});

app.listen(3001);