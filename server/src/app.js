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

app.get('/', (req, res) => res.status(200).send());

app.post('/register', (req, res) => {
    if(!req.body.firstName || !req.body.lastName || !req.body.username || !req.body.password){
        res.status(400).send();
    }else{
        const hash = crypto.createHash('sha256').update(req.body.password + req.body.username).digest('base64');
        const registerResponse = queries.register(req.body.firstName, req.body.lastName, req.body.username, hash)
        if(registerResponse){
            res.status(201).send(registerResponse);
        }else{
            res.status(500).send();
        }
        
    }
})

module.exports = app;