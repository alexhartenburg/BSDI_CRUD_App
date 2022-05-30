const queries = require("../src/queries");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
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

// MIDDLEWARE
function authenticateToken(request, response, next) {
    if (!request.headers || !request.headers["authorization"]) {
      return response.sendStatus(400);
    }
    const authHeader = request.headers["authorization"];
  
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return response.sendStatus(401);
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return response.sendStatus(401);
      request.user = user;
      response.status(201);
      next();
    });
  }


// ENDPOINTS
app.get('/', (req, res) => res.status(200).send());

app.post('/register', async (req, res) => {
    if(!req.body.firstName || !req.body.lastName || !req.body.username || !req.body.password){
        res.status(400).send("Required fields are missing");
    }else if(await queries.userExists(req.body.username)){
        res.status(409).send("Username is already taken");
    }else{
        const hash = crypto.createHash('sha256').update(req.body.password + req.body.username).digest('base64');
        const registerResponse = await queries.register(req.body.firstName, req.body.lastName, req.body.username, hash)
        if(registerResponse){
            res.status(201).send(registerResponse);
        }else{
            res.status(500).send("Database error");
        }
        
    }
})

app.post('/login', async (req, res) => {
    if(!req.body.username || !req.body.password){
        res.status(400).send("Required fields are missing");
    }else{
        let storedPassword = await queries.getPassword(req.body.username);
        let hash = crypto.createHash('sha256').update(req.body.password + req.body.username).digest('base64');
        if(storedPassword === hash){
// REPLACE RESPONSE BODY WITH A LEGIT TOKEN
            let user = await queries.getUserInfo(req.body.username);
            let token = jwt.sign(JSON.stringify(user), process.env.ACCESS_TOKEN_SECRET);
            res.status(200).send({token: token});
        }else{
            res.status(404).send("Incorrect username or password");
        }
    }
})

app.get('/posts', async (req, res) => {
    let posts = await queries.getPosts();
    if(posts){
        res.status(200).send(posts)
    }else{
        res.status(404).send("No posts were found")
    }
})

app.get('/posts/:userID', authenticateToken, async (req, res) => {
    let user = JSON.parse(atob(req.headers["authorization"].split(".")[1]).replaceAll("[", "").replaceAll("]", ""));
    let userID = req.params.userID;
    const num = Number(userID);
    if (!Number.isInteger(num) || num <= 0) {
        res.status(400).send('Invalid User ID')
    }else if(parseInt(userID) !== parseInt(user.id)){
        res.status(401).send();
    }else{
        let posts = await queries.getUserPosts(userID)
        if(posts){
            res.status(200).send(posts)
        }else{
            res.status(404).send(`Could not find any posts for user ${userID}`)
        }
    }
})

app.post('/post', authenticateToken, async (req, res) => {
    if(!req.body.userID || !req.body.title || !req.body.content){
        res.status(400).send("Required fields are missing");
    }else{
        let id = await queries.addPost({
            user_id: req.body.userID,
            title: req.body.title,
            content: req.body.content
        })
        if(id){
            res.status(200).send({
                id: id,
                userID: req.body.userID,
                title: req.body.title,
                content: req.body.content
            });
        }else{
            res.status(500).send("Database error");
        }
    }
})

app.delete('/post', authenticateToken, async (req, res) => {
    let user = JSON.parse(atob(req.headers["authorization"].split(".")[1]).replaceAll("[", "").replaceAll("]", ""));
    if(!req.body.id){
        res.status(400).send("Required fields are missing");
    }else{
        if(await queries.postExists(req.body.id)){
            let post = await queries.getPost(req.body.id);
            if(parseInt(post.user_id) !== parseInt(user.id)){
                res.status(401).send()
            }else{
                if(await queries.deletePost(req.body.id)){
                    res.status(200).send();
                }else{
                    res.status(500).send('Database error')
                }
            }
        }else{
            res.status(404).send('Could not find that post')
        }
    }
})

app.patch('/post', authenticateToken, async (req, res) => {
    let user = JSON.parse(atob(req.headers["authorization"].split(".")[1]).replaceAll("[", "").replaceAll("]", ""));
    if(!req.body.id || (!req.body.title && !req.body.content)){
        res.status(400).send('No new title or content was provided');
    }else if(await !queries.postExists(req.body.id)){
        res.status(404).send('Could not find that post');
    }else{
        let post = await queries.getPost(req.body.id);
        if(parseInt(post.user_id) !== parseInt(user.id)){
            res.status(401).send()
        }else{
            let update = await queries.updatePost(req.body);
            if(update){
                let post = await queries.getPost(req.body.id)
                res.status(200).send(post);
            }else{
                res.status(500).send('Database error');
            }
        }
    }
})

module.exports = {app, authenticateToken};