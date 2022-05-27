const queries = require("../src/queries");
const crypto = require('crypto');
const express = require('express');
const cors = require("cors");
const app = express();

var corsOptions = {
    origin: "*",
    methods: "GET, POST, OPTIONS, PUT, PATCH, DELETE",
    headers: "X-Requested-With,content-type",
    credentials: true,
};
app.use(express.json());
app.use(cors(corsOptions));

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/register', (req, res) => {
    if(!req.body.firstName || !req.body.lastName || !req.body.username || !req.body.password){
        res.status(400).send();
    }else{
        const registerResponse = queries.register(req.body.firstName, req.body.lastName, req.body.username, req.body.password)
        if(registerResponse){
            res.status(201).send(registerResponse);
        }else{
            res.status(400).send();
        }
        
    }
})

module.exports = app;