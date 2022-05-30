const env = process.env.NODE_ENV || "development";
const config = require("../knexfile.js")[env];
const knex = require("knex")(config);

const register = async (firstName, lastName, username, password) => {
    return await knex("users")
        .insert({
            first_name: firstName,
            last_name: lastName,
            username: username,
            password: password
        })
        .returning("id")
        .then(response => {
            return({
                id: response[0].id,
                firstName: firstName,
                lastName: lastName,
                username: username,
            })
        })
        .catch(err => {
            console.log(err)
            return(false)
        });
    
}

const userExists = async (username) => {
    let user =  await knex('users')
        .where("username", "=", username)
        .catch(err => {
            console.log(err)
        });
    if(user.length > 0){
        return true
    }else{
        return false
    }
}

const getPassword = async (username) => {
    let result = await knex('users')
        .select('password')
        .where('username', '=', username)
        .catch(err => {
            console.log(err)
        });
    if(result.length > 0){
        let hash = result[0].password;
        return hash;
    }else{
        return false;
    }
}

const getUserInfo = async (username) => {
    let user = await knex('users')
        .where('username', '=', username)
        .catch(err => {
            console.log(err);
            return false;
        });
    if(user.length > 0){
        return user;
    }else{
        return false;
    }
}

const addPost = async (post) => {
    return await knex('posts')
        .insert(post)
        .returning("id")
        .then(response => {
            return(response[0].id)
        })
        .catch(err => {
            console.log(err)
            return(false)
        });
}

const postExists = async (id) => {
    return await knex('posts')
        .where('id', '=', id)
        .then(response => {
            if(response.length > 0){
                return true;
            }else{
                return false;
            }
        })
        .catch(err => {
            console.log(err);
            return false;
        })
}

const deletePost = async (id) => {
    return await knex('posts')
        .where('id', '=', id)
        .del()
        .then(() => true)
        .catch(err => {
            console.log(err);
            return false;
        })
}

const updatePost = async (post) => {
    let newPost = {};
    if(Object.keys('title')){
        newPost.title = post.title;
    }
    if(Object.keys('content')){
        newPost.content = post.content;
    }
    return await knex('posts')
        .where('id', '=', post.id)
        .update(newPost)
        .returning('id', 'user_id', 'title', 'content')
        .then(response => true)
        .catch(err => {
            console.log(err);
            return false;
        })
}

const getPost = async (id) => {
    let post = await knex('posts')
        .where('id', '=', id)
        .catch(err => {
            console.log(err);
            return false;
        })
    if(post.length > 0){
        return post[0];
    }else{
        return false;
    }
}

const getUserPosts = async (userID) => {
    let posts = await knex('posts')
        .where('user_id', '=', userID)
        .catch(err => {
            console.log(err);
            return false;
        })
    if(posts.length > 0){
        return posts;
    }else{
        return false;
    }
}

const getPosts = async () => {
    let posts = await knex('posts')
        .catch(err => {
            console.log(err)
        });
    if(posts.length > 0){
        return posts
    }else{
        return false
    }
}

module.exports = {
    register,
    userExists,
    getPassword,
    getUserInfo,
    addPost,
    postExists,
    deletePost,
    updatePost,
    getPost,
    getUserPosts,
    getPosts
}