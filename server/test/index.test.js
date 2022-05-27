const supertest = require("supertest");
const crypto = require('crypto');
const app = require("../src/app.js")
const queries = require("../src/queries");
const request = supertest(app);

jest.mock("../src/queries")

describe("GET /", () => {
    test("should return status 200", async () => {
        const response = await request.get("/").send();
        expect(response.statusCode).toBe(200);
    })
})

describe("POST /register", () => {
    let registration;
    beforeEach(() => {
        registration = {
        firstName: "John",
        lastName: "Doe",
        username: "jdoe",
        password: "password",
        };
        const hash = crypto.createHash('sha256').update(registration.password + registration.username).digest('base64');
        jest.spyOn(queries, 'register').mockImplementation(() => {
            return({
                id: 1,
                firstName: "John",
                lastName: "Doe",
                username: "jdoe",
                password: hash,
            })
        })
    });
    test("should return status 201 on successful execution", async () => {
        const response = await request.post("/register").send(registration);
        expect(response.statusCode).toBe(201);
    })
    test("should return status 400 for missing arguments", async () => {
        const response = await request.post("/register").send();
        expect(response.statusCode).toBe(400);
    })
    test("should return the data added to the database", async () => {
        const hash = crypto.createHash('sha256').update(registration.password + registration.username).digest('base64');
        const response = await request.post("/register").send(registration);
        expect(response.body.firstName).toEqual("John");
        expect(response.body.lastName).toEqual("Doe");
        expect(response.body.username).toEqual("jdoe");
        expect(response.body.password).toBe(hash);
    })
    test("should return status 500 when there is an error with the database query", async () => {
        jest.spyOn(queries, 'register').mockImplementation(() => false)
        const response = await request.post("/register").send(registration);
        expect(response.statusCode).toBe(500);
    })
})