const supertest = require("supertest");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const {app, authenticateToken} = require("../src/app.js")
const queries = require("../src/queries");
const { response } = require("../src/app.js");
const request = supertest(app);

jest.mock("../src/queries")

describe("GET /", () => {
    test("should return status 200", async () => {
        let response = await request.get("/").send();
        expect(response.statusCode).toBe(200);
    })
})

describe("POST /register", () => {
    let registration;
    let hash;
    beforeEach(() => {
        registration = {
        firstName: "John",
        lastName: "Doe",
        username: "jdoe",
        password: "password",
        };
        hash = crypto.createHash('sha256').update(registration.password + registration.username).digest('base64');
        jest.spyOn(queries, 'register').mockImplementation(() => {
            return({
                id: 1,
                firstName: "John",
                lastName: "Doe",
                username: "jdoe",
                password: hash,
            })
        })
        jest.spyOn(queries, 'userExists').mockImplementation(() => false)
    });
    test("should return status 201 on successful execution", async () => {
        let response = await request.post("/register").send(registration);
        expect(response.statusCode).toBe(201);
    })
    test("should return status 400 for missing arguments", async () => {
        let response = await request.post("/register").send();
        expect(response.statusCode).toBe(400);
    })
    test("should return the data added to the database", async () => {
        let response = await request.post("/register").send(registration);
        expect(response.body.firstName).toEqual("John");
        expect(response.body.lastName).toEqual("Doe");
        expect(response.body.username).toEqual("jdoe");
        expect(response.body.password).toBe(hash);
    })
    test("should return status 500 when there is an error with the database query", async () => {
        jest.spyOn(queries, 'register').mockImplementation(() => false)
        let response = await request.post("/register").send(registration);
        expect(response.statusCode).toBe(500);
    })
    test("should return a status of 409 when the user tries to register a username that is already taken", async () => {
        jest.spyOn(queries, 'register').mockImplementation(() => false)
        jest.spyOn(queries, 'userExists').mockImplementation(() => true)
        let response = await request.post("/register").send(registration);
        expect(response.statusCode).toBe(409);
    })
})
describe("POST /login", () => {
    let hash;
    let credentials;
    beforeEach(() => {
        credentials = {
            username: "jdoe",
            password: "password"
        }
        hash = crypto.createHash('sha256').update(credentials.password + credentials.username).digest('base64');
    })
    test("should return status 200 and an authentication token when successfully completed", async () => {
        jest.spyOn(queries, 'getPassword').mockImplementation(() => hash)
        jest.spyOn(queries, 'getUserInfo').mockImplementation(() => {
            return({
                id: 1,
                firstName: "John",
                lastName: "Doe",
                username: "jdoe"
            })
        })
        let response = await request.post("/login").send(credentials);
        let payloadData = JSON.parse(atob(response.body.token.split(".")[1]).replaceAll("[", "").replaceAll("]", ""));
        expect(response.statusCode).toBe(200);
        expect(payloadData.id).toBe(1);
        expect(payloadData.firstName).toBe('John');
        expect(payloadData.lastName).toBe('Doe');
        expect(payloadData.username).toBe('jdoe');
    })
    test("should return status 400 for missing arguments", async () => {
        let response = await request.post("/login").send();
        expect(response.statusCode).toBe(400);
    })
    test("should return status 404 when there is no matching username", async () => {
        jest.spyOn(queries, 'getPassword').mockImplementation(() => false)
        let response = await request.post("/login").send(credentials);
        expect(response.statusCode).toBe(404);
    })
    test("should return status 404 when the hash does not match the stored hash", async () => {
        jest.spyOn(queries, 'getPassword').mockImplementation(() => {
            return(hash + "different_hash")
        })
        let response = await request.post("/login").send(credentials);
        expect(response.statusCode).toBe(404);
    })
})
describe("POST /post", () => {
    let post
    let user
    let token
    beforeEach(() => {
        post = {
            userID: 1,
            title: "Blog Post",
            content: "Bla bla bla bla bla bla bla bla bla bla bla bla bla bla"
        }
        user = {
            id: 1,
                firstName: "John",
                lastName: "Doe",
                username: "jdoe"
        };
        token = jwt.sign(JSON.stringify(user), process.env.ACCESS_TOKEN_SECRET);
    })
    test("should return status 400 for missing arguments", async () => {
        let response = await request.post("/post").send();
        expect(response.statusCode).toBe(400);
    })
    test("should return status 200 and the data added to the database", async () => {
        jest.spyOn(queries, 'addPost').mockImplementation(() => 1);
        let response = await request.post("/post").set('Authorization', `Bearer ${token}`).send(post);
        expect(response.body.id).toBe(1);
        expect(response.body.userID).toBe(post.userID);
        expect(response.body.title).toBe(post.title);
        expect(response.body.content).toBe(post.content);
    })
    test("should return status 500 when there is an error with the database query", async () => {
        jest.spyOn(queries, 'addPost').mockImplementation(() => false)
        let response = await request.post("/post").set('Authorization', `Bearer ${token}`).send(post);
        expect(response.statusCode).toBe(500);
    })
    test("should return status 400 when there is no token provided", async () => {
        let response = await request.post("/post").send(post);
        expect(response.statusCode).toBe(400);
    })
    test("should return status 401 when an invalid token is provided", async () => {
        let response = await request.post("/post").set('Authorization', 'Bearer asdlkfjhaslfjhalsjdfhasdjfh').send(post);
        expect(response.statusCode).toBe(401);
    })
})
describe("DELETE /post", () => {
    let post
    let user
    let token
    beforeEach(() => {
        post = {id: '1'};
        user = {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            username: "jdoe"
        };
        token = jwt.sign(JSON.stringify(user), process.env.ACCESS_TOKEN_SECRET);
    })
    
    test("should return status 400 for missing arguments", async () => {
        let response = await request.delete("/post").send();
        expect(response.statusCode).toBe(400);
    })
    test("should return status 200 on successful delete", async () => {
        jest.spyOn(queries, 'deletePost').mockImplementation(() => true);
        jest.spyOn(queries, 'postExists').mockImplementation(() => true);
        jest.spyOn(queries, 'getPost').mockImplementation(() => {
            return({
                id: 1,
                user_id: 1,
                title: 'title',
                content: 'content'
            })
        })
        let response = await request.delete("/post").set('Authorization', `Bearer ${token}`).send(post);
        expect(response.status).toBe(200);
    })
    test("should return status 404 for a post id that doesn't exist", async () => {
        jest.spyOn(queries, 'postExists').mockImplementation(() => false);
        let response = await request.delete("/post").set('Authorization', `Bearer ${token}`).send(post);
        expect(response.status).toBe(404);
    })
    test("should return status 500 when there is an error with the database query", async () => {
        jest.spyOn(queries, 'deletePost').mockImplementation(() => false)
        jest.spyOn(queries, 'postExists').mockImplementation(() => true);
        let response = await request.delete("/post").set('Authorization', `Bearer ${token}`).send(post);
        expect(response.statusCode).toBe(500);
    })
    test("should return status 400 when there is no token provided", async () => {
        let response = await request.delete("/post").send(post);
        expect(response.statusCode).toBe(400);
    })
    test("should return status 401 when an invalid token is provided", async () => {
        let response = await request.delete("/post").set('Authorization', 'Bearer asdlkfjhaslfjhalsjdfhasdjfh').send(post);
        expect(response.statusCode).toBe(401);
    })
})
describe("PATCH /post", () => {
    let user
    let token
    beforeEach(() => {
        user = {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            username: "jdoe"
        };
        token = jwt.sign(JSON.stringify(user), process.env.ACCESS_TOKEN_SECRET);
    })
    test("should return status 400 if the id and one other argument isn't provided", async () => {
        let response = await request.patch("/post").send();
        expect(response.statusCode).toBe(400);
        let post = {id: 1};
        response = await request.patch("/post").set('Authorization', `Bearer ${token}`).send(post);
        expect(response.statusCode).toBe(400);
        post = {title: "title"};
        response = await request.patch("/post").set('Authorization', `Bearer ${token}`).send(post);
        expect(response.statusCode).toBe(400);
    })
    test("should return status 404 if the post isn't found", async () => {
        jest.spyOn(queries, "postExists").mockImplementation(() => false);
        let post = {
            id: 1,
            title: 'title'
        }
        let response = await request.patch("/post").set('Authorization', `Bearer ${token}`).send(post);
        expect(response.status).toBe(404);
    })
    test("should return status 500 when there is an error with the database query", async () => {
        jest.spyOn(queries, 'postExists').mockImplementation(() => true);
        jest.spyOn(queries, 'updatePost').mockImplementation(() => false);
        let post = {
            id: 1,
            title: 'title'
        }
        let response = await request.patch("/post").set('Authorization', `Bearer ${token}`).send(post);
        expect(response.statusCode).toBe(500);
    })
    test("should return status 200 and the updated post data from the database", async () => {
        jest.spyOn(queries, 'postExists').mockImplementation(() => true);
        jest.spyOn(queries, 'updatePost').mockImplementation(() => true);
        jest.spyOn(queries, 'getPost').mockImplementation(() => {
            return({
                id: 1,
                user_id: 1,
                title: "title",
                content: "Bla bla bla bla bla bla bla bla bla bla bla bla bla bla"
            })
        });
        let post = {
            id: 1,
            title: 'title'
        }
        let response = await request.patch("/post").set('Authorization', `Bearer ${token}`).send(post);
        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe(1);
        expect(response.body.user_id).toBe(1);
        expect(response.body.title).toBe("title");
        expect(response.body.content).toBe("Bla bla bla bla bla bla bla bla bla bla bla bla bla bla");
    })
    test("should return status 400 when there is no token provided", async () => {
        let post = {
            id: 1,
            title: 'title'
        }
        let response = await request.patch("/post").send(post);
        expect(response.statusCode).toBe(400);
    })
    test("should return status 401 when an invalid token is provided", async () => {
        let post = {
            id: 1,
            title: 'title'
        }
        let response = await request.patch("/post").set('Authorization', 'Bearer asdlkfjhaslfjhalsjdfhasdjfh').send(post);
        expect(response.statusCode).toBe(401);
    })
})
describe("GET /posts/:userID", () => {
    let userID
    let user
    let token
    beforeEach(() => {
        userID = 1;
        user = {
            id: 1,
                firstName: "John",
                lastName: "Doe",
                username: "jdoe"
        };
        token = jwt.sign(JSON.stringify(user), process.env.ACCESS_TOKEN_SECRET);
    })
    test("should return status 404 if no posts for userID were found", async () => {
        jest.spyOn(queries, 'getUserPosts').mockImplementation(() => false)
        let response = await request.get(`/posts/${userID}`).set('Authorization', `Bearer ${token}`).send();
        expect(response.statusCode).toBe(404);
    })
    test("should return status 400 for an invalid userID", async () => {
        let response = await request.get(`/posts/bob`).set('Authorization', `Bearer ${token}`).send();
        expect(response.statusCode).toBe(400);
        response = await request.get(`/posts/1.5`).set('Authorization', `Bearer ${token}`).send();
        expect(response.statusCode).toBe(400);
        response = await request.get(`/posts/-3`).set('Authorization', `Bearer ${token}`).send();
        expect(response.statusCode).toBe(400);
    })
    test("should return status 200 and all user's posts", async () => {
        jest.spyOn(queries, 'getUserPosts').mockImplementation(() => {
            return([
                {
                    id: 1,
                    userID: 1,
                    title: "title",
                    content: "Bla bla bla bla bla bla bla bla bla bla bla bla bla bla"
                },
                {
                    id: 2,
                    userID: 1,
                    title: "title 2",
                    content: "Bla bla bla bla bla bla bla bla bla bla bla bla bla bla"
                }
            ])
        })
        let response = await request.get(`/posts/${userID}`).set('Authorization', `Bearer ${token}`).send();
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true)
        expect(response.body.length).toBe(2)
        expect(response.body[1].id).toBe(2)
    })
    test("should return status 400 when there is no token provided", async () => {
        let response = await request.get(`/posts/${userID}`).send();
        expect(response.statusCode).toBe(400);
    })
    test("should return status 401 when an invalid token is provided", async () => {
        let response = await request.get(`/posts/${userID}`).set('Authorization', 'Bearer asdlkfjhaslfjhalsjdfhasdjfh').send();
        expect(response.statusCode).toBe(401);
    })
})
describe("GET /posts", () => {
    test("should return status 404 if no posts are found", async () => {
        jest.spyOn(queries, 'getPosts').mockImplementation(() => false);
        let response = await request.get(`/posts`).send();
        expect(response.statusCode).toBe(404);

    })
    test("should return status 200 and all posts", async () => {
        jest.spyOn(queries, 'getPosts').mockImplementation(() => {
            return([
                {
                    id: 1,
                    userID: 1,
                    title: "title",
                    content: "Bla bla bla bla bla bla bla bla bla bla bla bla bla bla"
                },
                {
                    id: 2,
                    userID: 2,
                    title: "title 2",
                    content: "Bla bla bla bla bla bla bla bla bla bla bla bla bla bla"
                }
            ])
        })
        let response = await request.get(`/posts`).send();
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(2);
        expect(response.body[1].userID).toBe(2);
    })
})