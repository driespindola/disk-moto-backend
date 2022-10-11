const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const dbConnect = require('./db/dbConnect');
const User = require('./db/userModel');
const auth = require("./auth");


dbConnect();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
  });

app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

app.post("/register", (request, response) => {
    bcrypt.hash(request.body.password, 10)
        .then((hashedPassword) => {
            const user = new User({
                firstName: request.body.firstName,
                lastName: request.body.lastName,
                username: request.body.username,
                email: request.body.email,
                password: hashedPassword
            });
            user.save().then((result) => {
                response.status(201).send({
                    message: "User Created Sucessfully",
                    result,
                });
            })
            .catch((error) => {
                response.status(500).send({
                    message: "Error creating user",
                    error,
                });
            });
        })
        .catch((e) => {
            response.status(500).send({
                message: "Password was not hashed sucessfully",
                e,
            });
        });
});

app.post("/login", (request, response) => {
    
    User.findOne({ username: request.body.username })

    .then((user) => {
        bcrypt.compare(request.body.password, user.password)

        .then((passwordCheck) => {

            if(!passwordCheck) {
                return response.status(400).send({
                    message: "Passwords does not match",
                    error,
                });
            } 

            const token = jwt.sign(
                {
                    userId: user._id,
                    userUsername: user.username,
                },
                "RANDOM-TOKEN",
                { expiresIn: "24h" }
            );

            response.status(200).send({
                message: "Login Sucessful",
                username: user.username,
                token,
            });
        })
        .catch((error) => {
            response.status(400).send({
                message: "Passwords does not match",
                error,
            });
        })
    })
    .catch((e) => {
        response.status(404).send({
            message: "Username not Found",
            e,
        });
    });
})

app.get("/free-endpoint", (request, response) => {
    response.json({ message: "You are free to access me anytime" })
});

app.get("/auth-endpoint", auth, (request, response) => {
    response.json({ message: "You are authorized to access me" });
})

module.exports = app;